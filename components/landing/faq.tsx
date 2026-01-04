"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        question: "Is Zafra completely free?",
        answer: "Yes, Zafra is 100% open source and free to use for personal and commercial projects. Licensed under MIT.",
    },
    {
        question: "Can I use this for my commercial SaaS?",
        answer: "Absolutely! The goal is to help you monetize faster. You own everything you build with it.",
    },
    {
        question: "How do I deploy this?",
        answer: "You can deploy easily to Vercel, Netlify, or any VPS that supports Node.js/Bun. We recommend Vercel for the best Next.js experience.",
    },
    {
        question: "Do I need to use Supabase?",
        answer: "It is configured out of the box, but you can swap it for any other backend or database if you prefer.",
    },
]

export function FAQ() {
    return (
        <section className="container py-24 sm:py-32 space-y-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold md:text-5xl">Frequently Asked Questions</h2>
                <p className="text-muted-foreground mt-4 text-lg">
                    Got questions? We've got answers.
                </p>
            </div>
            <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
