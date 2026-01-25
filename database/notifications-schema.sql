-- Comprehensive Notifications Schema for AutoTradeHub

-- Drop existing notifications table if it exists (for development)
DROP TABLE IF EXISTS notifications CASCADE;

-- Create notifications table
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'system' 
        CHECK (type IN ('payment', 'order', 'admin', 'system', 'promotion', 'shipping')),
    icon VARCHAR(100) DEFAULT 'bell',
    read BOOLEAN DEFAULT false NOT NULL,
    link TEXT,
    metadata JSONB DEFAULT '{}',
    priority VARCHAR(20) DEFAULT 'medium' 
        CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_priority ON notifications(priority);

-- Enable RLS (Row Level Security)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" 
    ON notifications FOR SELECT 
    USING (auth.uid() = user_id);

-- Users can only insert their own notifications (system can bypass)
CREATE POLICY "Users can insert their own notifications" 
    ON notifications FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Users can only update their own notifications
CREATE POLICY "Users can update their own notifications" 
    ON notifications FOR UPDATE 
    USING (auth.uid() = user_id);

-- Users can only delete their own notifications
CREATE POLICY "Users can delete their own notifications" 
    ON notifications FOR DELETE 
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to get unread count for a user
CREATE OR REPLACE FUNCTION get_unread_notifications_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER 
        FROM notifications 
        WHERE user_id = p_user_id AND read = false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
    UPDATE notifications 
    SET read = true 
    WHERE user_id = p_user_id AND read = false;
    
    RETURN (
        SELECT COUNT(*)::INTEGER 
        FROM notifications 
        WHERE user_id = p_user_id AND read = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification (for system use)
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_title VARCHAR(255),
    p_message TEXT,
    p_type VARCHAR(50) DEFAULT 'system',
    p_icon VARCHAR(100) DEFAULT 'bell',
    p_link TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}',
    p_priority VARCHAR(20) DEFAULT 'medium'
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (
        user_id, title, message, type, icon, link, metadata, priority
    ) VALUES (
        p_user_id, p_title, p_message, p_type, p_icon, p_link, p_metadata, p_priority
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Grant necessary permissions
GRANT ALL ON notifications TO authenticated;
GRANT ALL ON notifications TO service_role;
GRANT EXECUTE ON FUNCTION get_unread_notifications_count TO authenticated;
GRANT EXECUTE ON FUNCTION get_unread_notifications_count TO service_role;
GRANT EXECUTE ON FUNCTION mark_all_notifications_read TO authenticated;
GRANT EXECUTE ON FUNCTION mark_all_notifications_read TO service_role;
GRANT EXECUTE ON FUNCTION create_notification TO authenticated;
GRANT EXECUTE ON FUNCTION create_notification TO service_role;
