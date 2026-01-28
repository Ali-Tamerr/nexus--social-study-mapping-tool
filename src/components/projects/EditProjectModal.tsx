'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input, TextArea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface EditProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; description?: string }) => Promise<void>;
    loading?: boolean;
    initialData: {
        name: string;
        description?: string;
    };
}

export function EditProjectModal({ isOpen, onClose, onSubmit, loading, initialData }: EditProjectModalProps) {
    const [name, setName] = useState(initialData.name);
    const [description, setDescription] = useState(initialData.description || '');

    useEffect(() => {
        if (isOpen) {
            setName(initialData.name);
            setDescription(initialData.description || '');
        }
    }, [isOpen, initialData]);

    const handleSubmit = async () => {
        if (!name.trim()) return;

        await onSubmit({
            name: name.trim(),
            description: description.trim() || undefined,
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit project"
            description="Update project details"
        >
            <div className="space-y-4">
                <Input
                    label="Project name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My Knowledge Graph"
                    autoFocus
                />

                <TextArea
                    label="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A brief description of your project..."
                    rows={3}
                />
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="brand"
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                    loading={loading}
                    icon={<Save className="h-4 w-4" />}
                >
                    Save changes
                </Button>
            </div>
        </Modal>
    );
}
