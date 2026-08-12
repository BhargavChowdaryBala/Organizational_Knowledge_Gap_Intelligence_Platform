package com.knowledgegap.controller;

import com.knowledgegap.entity.Notification;
import com.knowledgegap.entity.User;
import com.knowledgegap.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    // Create Notification
    @PostMapping
    public Notification createNotification(
            @RequestBody Notification notification) {

        return service.createNotification(notification);
    }

    // Get All Notifications
    @GetMapping
    public List<Notification> getAllNotifications() {
        return service.getAllNotifications();
    }

    // Get Notification By ID
    @GetMapping("/{id}")
    public Notification getNotificationById(
            @PathVariable Integer id) {

        return service.getNotificationById(id);
    }

    // Get Notifications By User
    @PostMapping("/user")
    public List<Notification> getNotificationsByUser(
            @RequestBody User user) {

        return service.getNotificationsByUser(user);
    }

    // Get Unread Notifications
    @PostMapping("/unread")
    public List<Notification> getUnreadNotifications(
            @RequestBody User user) {

        return service.getUnreadNotifications(user);
    }

    // Get Notifications By Type
    @GetMapping("/type/{type}")
    public List<Notification> getNotificationsByType(
            @PathVariable String type) {

        return service.getNotificationsByType(type);
    }

    // Get Latest Notifications
    @GetMapping("/latest")
    public List<Notification> getLatestNotifications() {
        return service.getLatestNotifications();
    }

    // Mark Notification As Read
    @PutMapping("/read/{id}")
    public Notification markAsRead(
            @PathVariable Integer id) {

        return service.markAsRead(id);
    }

    // Update Notification
    @PutMapping("/{id}")
    public Notification updateNotification(
            @PathVariable Integer id,
            @RequestBody Notification notification) {

        return service.updateNotification(id, notification);
    }

    // Delete Notification
    @DeleteMapping("/{id}")
    public String deleteNotification(
            @PathVariable Integer id) {

        service.deleteNotification(id);

        return "Notification Deleted Successfully";
    }

}