package com.knowledgegap.service;

import com.knowledgegap.entity.Notification;
import com.knowledgegap.entity.User;

import java.util.List;

public interface NotificationService {

    // Create
    Notification createNotification(Notification notification);

    // Read
    List<Notification> getAllNotifications();

    Notification getNotificationById(Integer notificationId);

    List<Notification> getNotificationsByUser(User user);

    List<Notification> getUnreadNotifications(User user);

    List<Notification> getNotificationsByType(String type);

    List<Notification> getLatestNotifications();

    // Update
    Notification markAsRead(Integer notificationId);

    Notification updateNotification(Integer notificationId,
                                    Notification notification);

    // Delete
    void deleteNotification(Integer notificationId);

}