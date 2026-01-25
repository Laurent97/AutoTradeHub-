-- Migration script to update existing notifications table
-- This adds missing columns to an existing table

-- Check if priority column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'notifications' 
        AND column_name = 'priority'
    ) THEN
        ALTER TABLE notifications ADD COLUMN priority VARCHAR(20) DEFAULT 'medium';
        RAISE NOTICE 'Added priority column';
    ELSE
        RAISE NOTICE 'Priority column already exists';
    END IF;
END $$;

-- Add priority constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.check_constraints 
        WHERE constraint_name = 'notifications_priority_check'
    ) THEN
        ALTER TABLE notifications ADD CONSTRAINT notifications_priority_check 
        CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
        RAISE NOTICE 'Added priority constraint';
    ELSE
        RAISE NOTICE 'Priority constraint already exists';
    END IF;
END $$;

-- Check if type constraint exists and update it if needed
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.check_constraints 
        WHERE constraint_name = 'notifications_type_check'
    ) THEN
        ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
        CHECK (type IN ('payment', 'order', 'admin', 'system', 'promotion', 'shipping'));
        RAISE NOTICE 'Added type constraint';
    ELSE
        RAISE NOTICE 'Type constraint already exists';
    END IF;
END $$;

-- Check if metadata column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'notifications' 
        AND column_name = 'metadata'
    ) THEN
        ALTER TABLE notifications ADD COLUMN metadata JSONB DEFAULT '{}';
        RAISE NOTICE 'Added metadata column';
    ELSE
        RAISE NOTICE 'Metadata column already exists';
    END IF;
END $$;

-- Check if icon column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'notifications' 
        AND column_name = 'icon'
    ) THEN
        ALTER TABLE notifications ADD COLUMN icon VARCHAR(100) DEFAULT 'bell';
        RAISE NOTICE 'Added icon column';
    ELSE
        RAISE NOTICE 'Icon column already exists';
    END IF;
END $$;

-- Check if link column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'notifications' 
        AND column_name = 'link'
    ) THEN
        ALTER TABLE notifications ADD COLUMN link TEXT;
        RAISE NOTICE 'Added link column';
    ELSE
        RAISE NOTICE 'Link column already exists';
    END IF;
END $$;

-- Create missing indexes
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Update existing notifications to have default priority if it's null
UPDATE notifications SET priority = 'medium' WHERE priority IS NULL;

-- Update existing notifications to have default icon if it's null
UPDATE notifications SET icon = 'bell' WHERE icon IS NULL;

-- Update existing notifications to have default metadata if it's null
UPDATE notifications SET metadata = '{}' WHERE metadata IS NULL;

DO $$
BEGIN
    RAISE NOTICE 'Notifications table migration completed successfully!';
END $$;
