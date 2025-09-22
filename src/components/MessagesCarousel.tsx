'use client';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

export default function MessagesCarousel({ messages }: { messages: any[] }) {

  if (!messages || messages.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-6">
        You haven&apos;t received any messages.
      </div>
    );
  }
  
  return (
    <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full max-w-lg md:max-w-xl">
      <CarouselContent>
        {messages.map((message, index) => (
          <CarouselItem key={index} className="p-4">
            <Card>
              <CardHeader>
                <CardTitle>{"Message from Anonymous User"}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                <Mail className="flex-shrink-0" />
                <div>
                  <p>{message.content}</p>
                  <p className="text-xs text-muted-foreground">{message.createdAt}</p>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
