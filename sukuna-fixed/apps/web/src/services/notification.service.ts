import { Notification, INotification } from '@/models/notification.model';
import { User, type IUser } from '@/models/user.model';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

interface SendNotificationParams {
  schoolId: string;
  userId: string;
  title: string;
  message: string;
  type: INotification['type'];
  priority: INotification['priority'];
  channels?: ('IN_APP' | 'PUSH' | 'EMAIL' | 'SMS')[];
}

export class NotificationService {
  
  /**
   * Main entry point to dispatch a notification across multiple channels
   */
  async dispatch(params: SendNotificationParams): Promise<void> {
    await connectDB();
    
    const user = await User.findById(params.userId);
    if (!user) return;

    // Filter channels based on user preferences and system defaults
    const activeChannels = this.resolveChannels(params.channels || ['IN_APP'], user.notificationPreferences, params.type);

    // Always create an IN_APP record if requested
    if (activeChannels.includes('IN_APP')) {
      await Notification.create({
        schoolId: new mongoose.Types.ObjectId(params.schoolId),
        userId: new mongoose.Types.ObjectId(params.userId),
        title: params.title,
        message: params.message,
        type: params.type,
        priority: params.priority,
        deliveryChannels: activeChannels
      });
      
      // TODO: Emit via Socket.io / Server Sent Events for real-time delivery
      // socketService.emitToUser(params.userId, 'new_notification', notification);
    }

    // Process external delivery channels asynchronously
    if (activeChannels.includes('PUSH')) this.sendPush(params, user);
    if (activeChannels.includes('EMAIL')) this.sendEmail(params, user);
    if (activeChannels.includes('SMS')) this.sendSMS(params, user);
  }

  private resolveChannels(requested: string[], prefs: IUser['notificationPreferences'] | undefined, type: string): string[] {
    const resolved: string[] = [];
    if (requested.includes('IN_APP')) resolved.push('IN_APP');
    
    // Respect user preferences for external channels
    if (requested.includes('PUSH') && prefs?.push) {
      if (type === 'TRANSPORT' && !prefs.transport) return resolved;
      if (type === 'ASSIGNMENT' && !prefs.assignment) return resolved;
      if (type === 'RESULT' && !prefs.result) return resolved;
      resolved.push('PUSH');
    }
    
    if (requested.includes('EMAIL') && prefs?.email) resolved.push('EMAIL');
    if (requested.includes('SMS') && prefs?.sms) resolved.push('SMS');

    return resolved;
  }

  // --- External Providers ---
  
  private async sendPush(params: SendNotificationParams, user: IUser) {
    // Integration point for FCM (Firebase Cloud Messaging) or APNs
    console.log(`[PUSH] -> User ${user.phone}: ${params.title}`);
  }

  private async sendEmail(params: SendNotificationParams, user: IUser) {
    // Integration point for AWS SES / SendGrid
    console.log(`[EMAIL] -> User ${user.phone}: ${params.title}`);
  }

  private async sendSMS(params: SendNotificationParams, user: IUser) {
    // Integration point for Akash SMS / Twilio
    console.log(`[SMS] -> User ${user.phone}: ${params.title}`);
  }
}

export const notificationService = new NotificationService();
