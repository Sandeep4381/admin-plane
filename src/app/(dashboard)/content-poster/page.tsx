"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Eye, X } from "lucide-react";

type ContentItem = {
    id: string;
    name: string;
    images: string[];
};

const initialContent: ContentItem[] = [
    { id: 'CONT001', name: 'Homepage Welcome Banners', images: ['https://picsum.photos/seed/c1/800/450', 'https://picsum.photos/seed/c2/800/450', 'https://picsum.photos/seed/c3/800/450'] },
    { id: 'CONT002', name: 'New User Guide', images: ['https://picsum.photos/seed/c4/800/450'] },
    { id: 'CONT003', name: 'Promotional Event "Summer Splash"', images: ['https://picsum.photos/seed/c5/800/450', 'https://picsum.photos/seed/c6/800/450'] },
];

function ContentDialog({ onSave, trigger, contentToEdit }: { onSave: (item: Omit<ContentItem, 'id'>) => void, trigger: React.ReactNode, contentToEdit?: ContentItem | null }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(contentToEdit?.name || '');
    const [images, setImages] = useState<string[]>(contentToEdit?.images || []);
    const { toast } = useToast();

    React.useEffect(() => {
        if (open) {
            setName(contentToEdit?.name || '');
            setImages(contentToEdit?.images || []);
        }
    }, [open, contentToEdit]);

    const handleSave = () => {
        if (!name) {
            toast({ title: "Validation Error", description: "Content name is required.", variant: "destructive" });
            return;
        }
        onSave({ name, images });
        setOpen(false);
    };
    
    const addImage = () => {
        setImages([...images, `https://picsum.photos/seed/${Math.random()}/800/450`]);
    }
    
    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{contentToEdit ? 'Edit Content' : 'Add New Content'}</DialogTitle>
                    <DialogDescription>{contentToEdit ? 'Update the details for this content.' : 'Add a new content item with multiple images.'}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-2">
                        <Label htmlFor="name">Content Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Images</Label>
                            <Button variant="outline" size="sm" onClick={addImage}><PlusCircle className="mr-2 h-4 w-4" /> Add Image</Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {images.map((src, index) => (
                                <div key={index} className="relative group">
                                    <Image src={src} alt={`Content image ${index + 1}`} width={200} height={112} className="rounded-md object-cover aspect-video" />
                                    <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeImage(index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        {images.length === 0 && (
                            <div className="text-center text-muted-foreground border-2 border-dashed rounded-md p-8">
                                No images have been added.
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>{contentToEdit ? 'Save Changes' : 'Create Content'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ViewContentDialog({ contentItem, onOpenChange }: { contentItem: ContentItem | null; onOpenChange: (open: boolean) => void }) {
    if (!contentItem) return null;

    return (
        <Dialog open={!!contentItem} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{contentItem.name}</DialogTitle>
                    <DialogDescription>Content ID: {contentItem.id}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {contentItem.images.length > 0 ? (
                        <Carousel>
                            <CarouselContent>
                                {contentItem.images.map((src, index) => (
                                    <CarouselItem key={index}>
                                        <div className="p-1">
                                            <div className="relative aspect-video">
                                                <Image src={src} alt={`Content image ${index + 1}`} fill className="rounded-md object-cover" />
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    ) : (
                        <p className="text-muted-foreground text-center">No images available for this content.</p>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export default function ContentPosterPage() {
    const [contentList, setContentList] = useState(initialContent);
    const [viewingContent, setViewingContent] = useState<ContentItem | null>(null);
    const { toast } = useToast();

    const handleSaveContent = (item: Omit<ContentItem, 'id'>, id?: string) => {
        if (id) {
            setContentList(contentList.map(c => c.id === id ? { ...c, ...item } : c));
            toast({ title: "Content Updated", description: "The content item has been successfully updated." });
        } else {
            const newContent: ContentItem = {
                id: `CONT${Date.now()}`,
                ...item,
            };
            setContentList([newContent, ...contentList]);
            toast({ title: "Content Added", description: "The new content item has been successfully created." });
        }
    };
    
    const handleDeleteContent = (id: string) => {
        setContentList(contentList.filter(c => c.id !== id));
        toast({ title: "Content Deleted", variant: "destructive" });
    }

    return (
        <>
            <PageHeader title="Content/Poster Management">
                 <ContentDialog
                    onSave={(item) => handleSaveContent(item)}
                    trigger={
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Content
                        </Button>
                    }
                />
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Content List</CardTitle>
                    <CardDescription>Manage posters and other content for your website.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image/Poster</TableHead>
                                <TableHead>Name of Content</TableHead>
                                <TableHead>Content ID</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contentList.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Image src={item.images[0] || 'https://picsum.photos/200/112'} alt={item.name} width={100} height={56} className="rounded-md object-cover aspect-video" />
                                    </TableCell>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => setViewingContent(item)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <ContentDialog
                                                onSave={(updatedItem) => handleSaveContent(updatedItem, item.id)}
                                                contentToEdit={item}
                                                trigger={
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                }
                                            />
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the content item.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteContent(item.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <ViewContentDialog
                contentItem={viewingContent}
                onOpenChange={(open) => !open && setViewingContent(null)}
            />
        </>
    );
}
