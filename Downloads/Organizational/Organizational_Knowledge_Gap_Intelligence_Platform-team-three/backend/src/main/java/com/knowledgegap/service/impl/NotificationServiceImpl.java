package com.knowledgegap.service.impl;

import com.knowledgegap.entity.Notification;
import com.knowledgegap.entity.User;
import com.knowledgegap.repository.NotificationRepository;
import com.knowledgegap.service.NotificationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repository;

    public NotificationServiceImpl(NotificationRepository repository) {
        this.repository = repository;
    }

    @Override
    public Notification createNotification(Notification notification) {
        return repository.save(notification);
    }

    @Override
    public List<Notification> getAllNotifications() {
        return repository.findAll();
    }

    @Override
    public Notification getNotificationById(Integer notificationId) {

        return repository.findById(notificationId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found with ID : " + notificationId));
    }

    @Override
    public List<Notification> getNotificationsByUser(User user) {
        return repository.findByUser(user);
    }

    @Override
    public List<Notification> getUnreadNotifications(User user) {
        return repository.findByUserAndIsRead(user, false);
    }

    @Override
    public List<Notification> getNotificationsByType(String type) {
        return repository.findByType(type);
    }

    @Override
    public List<Notification> getLatestNotifications() {
        return repository.findTop10ByOrderByCreatedAtDesc();
    }

    @Override
    public Notification markAsRead(Integer notificationId) {

        Notification notification = repository.findById(notificationId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found with ID : " + notificationId));

        notification.setIsRead(true);

        return repository.save(notification);
    }

    @Override
    public Notification updateNotification(Integer notificationId,
                                           Notification notification) {

        Notification existing = repository.findById(notificationId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found with ID : " + notificationId));

        existing.setUser(notification.getUser());
        existing.setTitle(notification.getTitle());
        existing.setMessage(notification.getMessage());
        existing.setType(notification.getType());
        existing.setIsRead(notification.getIsRead());
        existing.setCreatedAt(notification.getCreatedAt());

        return repository.save(existing);
    }

    @Override
    public void deleteNotification(Integer notificationId) {

        Notification notification = repository.findById(notificationId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found with ID : " + notificationId));

        repository.delete(notification);
    }
}