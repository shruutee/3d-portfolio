"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowUpRight, FileText, Loader2, Mail, Send } from "lucide-react";
import { contactFormSchema, type ContactForm } from "@/lib/validations";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

const contactLinks = [
  {
    href: "mailto:shruti100905@gmail.com",
    label: "Email",
    icon: Mail,
  },
  {
    href: "https://github.com/shruutee",
    label: "GitHub",
    icon: ArrowUpRight,
  },
  {
    href: "https://www.linkedin.com/in/shrutisharma92345/",
    label: "LinkedIn",
    icon: ArrowUpRight,
  },
  {
    href: "/shruti-sharma-cv.pdf",
    label: "View CV",
    icon: FileText,
  },
];

const CONTACT_EMAIL = "shruti100905@gmail.com";

function buildMailtoUrl(data: ContactForm) {
  const subject = encodeURIComponent(`Portfolio contact from ${data.name}`);
  const body = encodeURIComponent(
    [`Name: ${data.name}`, `Email: ${data.email}`, "", data.message].join("\n")
  );

  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

function openMailDraft(data: ContactForm) {
  window.open(buildMailtoUrl(data), "_self");
}

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        if (res.status === 404 || res.status === 503) {
          openMailDraft(data);
          toast.message("Opening your email app.", {
            description: "Your message has been prepared so you can send it directly.",
          });
          return;
        }
        throw new Error(body?.error ?? "Unable to send message.");
      }

      toast.success("Message sent.", {
        description: "Thanks for reaching out. I will reply soon.",
      });
      reset();
    } catch (error) {
      openMailDraft(data);
      toast.error("Message could not be sent.", {
        description:
          error instanceof Error
            ? `${error.message} I opened your email app as a fallback.`
            : "I opened your email app as a fallback.",
      });
    }
  };

  return (
    <section
      id="contact"
      className="relative py-32"
      aria-labelledby="contact-heading"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />

      <div className="container-apple max-w-2xl text-center">
        <ScrollReveal>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Let&apos;s Talk
          </span>
          <h2 id="contact-heading" className="text-headline gradient-text mt-4">
            Let&apos;s build something together
          </h2>
          <p className="mx-auto mt-5 max-w-md text-body text-muted-foreground">
            Want to chat about tech, opportunities, or just say hi? Drop me a
            message - I&apos;d love to hear from you.
          </p>
        </ScrollReveal>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {contactLinks.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2 text-xs font-medium backdrop-blur-xl transition-colors hover:bg-accent"
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
        </div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit(onSubmit)}
          className="mt-12 space-y-4 text-left"
          noValidate
        >
          <div>
            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <input
              id="name"
              {...register("name")}
              placeholder="Your name"
              autoComplete="name"
              className="w-full rounded-xl border border-border bg-card/40 px-5 py-4 text-sm backdrop-blur-xl transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p role="alert" className="mt-1.5 text-xs text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="you@email.com"
              autoComplete="email"
              className="w-full rounded-xl border border-border bg-card/40 px-5 py-4 text-sm backdrop-blur-xl transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p role="alert" className="mt-1.5 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="sr-only">
              Message
            </label>
            <textarea
              id="message"
              {...register("message")}
              placeholder="Tell me what you're working on..."
              rows={5}
              className="w-full resize-none rounded-xl border border-border bg-card/40 px-5 py-4 text-sm backdrop-blur-xl transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
              aria-invalid={!!errors.message}
            />
            {errors.message && (
              <p role="alert" className="mt-1.5 text-xs text-red-500">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="flex justify-center pt-2">
            <MagneticButton
              type="submit"
              disabled={isSubmitting}
              className="bg-foreground text-background hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send message
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </MagneticButton>
          </div>
        </motion.form>

        <p className="mt-8 text-xs text-muted-foreground">
          Or click the chat button bottom-right to talk to my AI.
        </p>
      </div>
    </section>
  );
}
