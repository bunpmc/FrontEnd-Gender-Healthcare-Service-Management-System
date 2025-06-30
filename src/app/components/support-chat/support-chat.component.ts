import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

interface ChatMessage {
  id: string;
  from: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isTyping?: boolean;
  doctorRecommendations?: DoctorRecommendation[];
}

interface DoctorRecommendation {
  name: string;
  specialty: string;
  bio: string;
  contact_email: string;
  phone?: string;
  office_address?: string;
  doctor_id: string;
  profile_link: string;
}

interface ChatResponse {
  response: string;
  context_used: boolean;
  doctor_recommendations?: DoctorRecommendation[];
  session_id?: string;
}

interface ChatRequest {
  query: string;
  user_id?: string;
}

@Component({
  selector: 'app-support-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-chat.component.html',
  styleUrls: ['./support-chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportChatComponent implements AfterViewChecked, OnDestroy {
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('chatBody') chatBody!: ElementRef<HTMLDivElement>;

  showChatPanel = false;
  message = '';
  isTyping = false;
  isConnected = true;
  unreadCount = 0;
  sessionId?: string;
  userId?: string; // Add this if you have user authentication

  messages: ChatMessage[] = [];

  private destroy$ = new Subject<void>();
  private shouldScrollToBottom = false;
  private messageIdCounter = 0;
  private readonly API_BASE_URL = 'https://0cae-14-169-234-113.ngrok-free.app';

  quickReplies: string[] = [
    'How can I help you?',
    'Find me a gynecologist',
    'I need a hormone specialist',
    'Show me available doctors',
    'I need technical support',
  ];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.initializeChat();
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeChat() {
    this.addMessage(
      'bot',
      "Hello! 👋 I'm your healthcare assistant. I can help you find doctors, answer health questions, and provide support. How can I help you today?"
    );
  }

  private generateMessageId(): string {
    return `msg_${++this.messageIdCounter}_${Date.now()}`;
  }

  private addMessage(
    from: 'user' | 'bot',
    text: string,
    doctorRecommendations?: DoctorRecommendation[]
  ): void {
    const message: ChatMessage = {
      id: this.generateMessageId(),
      from,
      text,
      timestamp: new Date(),
      doctorRecommendations,
    };

    this.messages = [...this.messages, message];
    this.shouldScrollToBottom = true;

    if (from === 'bot' && !this.showChatPanel) {
      this.unreadCount++;
    }

    this.cdr.markForCheck();
  }

  private scrollToBottom(): void {
    if (this.chatBody?.nativeElement) {
      const element = this.chatBody.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  toggleChat(): void {
    this.showChatPanel = !this.showChatPanel;

    if (this.showChatPanel) {
      this.unreadCount = 0;
      this.cdr.markForCheck();

      setTimeout(() => {
        this.messageInput?.nativeElement?.focus();
      }, 300);
    }
  }

  sendMessage(messageText?: string): void {
    const userMessage = (messageText || this.message).trim();
    if (!userMessage) return;

    this.addMessage('user', userMessage);
    this.message = '';
    this.isTyping = true;
    this.cdr.markForCheck();

    const chatRequest: ChatRequest = {
      query: userMessage,
      user_id: this.userId, // Include user_id if available
    };

    this.http
      .post<ChatResponse>(`${this.API_BASE_URL}/chat`, chatRequest)
      .pipe(takeUntil(this.destroy$), debounceTime(100))
      .subscribe({
        next: (response) => {
          this.isTyping = false;

          // Store session ID for anonymous users
          if (response.session_id && !this.userId) {
            this.sessionId = response.session_id;
          }

          // Add bot response with doctor recommendations if available
          this.addMessage(
            'bot',
            response.response,
            response.doctor_recommendations
          );

          // If there are doctor recommendations, add a helpful follow-up message
          if (
            response.doctor_recommendations &&
            response.doctor_recommendations.length > 0
          ) {
            setTimeout(() => {
              this.addMessage(
                'bot',
                `I found ${
                  response.doctor_recommendations!.length
                } doctor(s) that might help you. You can contact them directly using the information provided above, or ask me for more specific recommendations!`
              );
            }, 1000);
          }
        },
        error: (error) => {
          console.error('Chat error:', error);
          this.isTyping = false;
          this.isConnected = false;

          const errorMessage = this.getErrorMessage(error);
          this.addMessage('bot', errorMessage);

          // Try to reconnect after 3 seconds
          setTimeout(() => {
            this.isConnected = true;
            this.cdr.markForCheck();
          }, 3000);
        },
      });
  }

  private getErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'Connection lost. Trying to reconnect... Please check if the server is running on http://localhost:8000';
    } else if (error.status >= 500) {
      return 'Server error. Please try again in a moment.';
    } else if (error.status === 429) {
      return 'Too many requests. Please wait a moment.';
    } else if (error.status === 503) {
      return 'Service temporarily unavailable. The system is still loading, please try again in a few moments.';
    } else if (error.status === 404) {
      return 'Chat service not found. Please check if the server is running properly.';
    }
    return `Something went wrong (Error ${error.status}). Please try again.`;
  }

  sendQuickReply(reply: string): void {
    this.sendMessage(reply);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.messages = [];
    this.sessionId = undefined;
    this.initializeChat();
    this.cdr.markForCheck();
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }

  // Helper method to check if a message has doctor recommendations
  hasDoctorRecommendations(message: ChatMessage): boolean {
    return !!(
      message.doctorRecommendations && message.doctorRecommendations.length > 0
    );
  }

  // Helper method to open doctor profile
  openDoctorProfile(profileLink: string): void {
    window.open(profileLink, '_blank');
  }

  // Helper method to copy doctor contact info
  copyContactInfo(contactEmail: string): void {
    navigator.clipboard
      .writeText(contactEmail)
      .then(() => {
        // You could show a toast notification here
        console.log('Contact email copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy contact info: ', err);
      });
  }

  // Method to check server health
  checkServerHealth(): void {
    this.http
      .get(`${this.API_BASE_URL}/health`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Server health:', response);
          this.isConnected = true;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Server health check failed:', error);
          this.isConnected = false;
          this.cdr.markForCheck();
        },
      });
  }

  // Method to load chat history (if user is logged in)
  loadChatHistory(): void {
    if (!this.userId) {
      console.log('No user ID available for chat history');
      return;
    }

    this.http
      .get(`${this.API_BASE_URL}/chat/history/${this.userId}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.success && response.data?.chat_history) {
            // Process and display chat history
            console.log('Chat history loaded:', response.data.chat_history);
            // You could implement UI to show/hide chat history here
          }
        },
        error: (error) => {
          console.error('Failed to load chat history:', error);
        },
      });
  }
}
