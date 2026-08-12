package com.knowledgegap.repository;

import com.knowledgegap.entity.Notification;
import com.knowledgegap.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    // Get all notifications of a user
    List<Notification> findByUser(User user);

    // Get unread notifications
    List<Notification> findByUserAndIsRead(User user, Boolean isRead);

    // Get notifications by type
    List<Notification> findByType(String type);

    // Latest notifications
    List<Notification> findTop10ByOrderByCreatedAtDesc();

}