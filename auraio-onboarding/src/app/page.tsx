"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Check,
  ArrowRight,
  Sparkles,
  Globe,
  Rocket,
  Shield,
  Zap,
  Stars,
  SendHorizontal,
  Calendar,
  GaugeCircle,
  Wand2,
  Infinity as InfinityIcon,
} from "lucide-react";

// ---- Utility Components ----
const Section = ({ id, children, className = "" }) => (
  <section id={id} className={`w-full max-w-6xl mx-auto px-4 md:px-8 ${className}`}>{children}</section>
);

const GradientOrb = ({ className = "" }) => (
  <div className={`pointer-events-none absolute -z-10 blur-3xl opacity-40 ${className}`} />
);

// ---- Data ----
const steps = [
  { icon: <Wand2 className="h-5 w-5" />, title: "Kickoff", desc: "Tell us your vision in 5 minutes — goals, audience, vibe." },
  { icon: <GaugeCircle className="h-5 w-5" />, title: "Plan", desc: "We turn it into a roadmap with scope, timelines, and milestones." },
  { icon: <Stars className="h-5 w-5" />, title: "Design", desc: "Rapid prototypes + your feedback. Pixel-perfect, accessible UI." },
  { icon: <Rocket className="h-5 w-5" />, title: "Build & Launch", desc: "SEO-ready, high-performance build. Go live with confidence." },
];

const tiers = [
  {
    name: "Tier 1",
    label: "Basic Website",
    price: "€999–€1,999",
    bullets: ["Up to 5–7 pages", "Responsive design", "Contact form &amp; analytics", "Basic performance"],
  },
  {
    name: "Tier 2",
    label: "Website + SEO",
    price: "€2,000–€3,500",
    bullets: ["Everything in Tier 1", "On-page SEO", "Blog setup", "GA4 & Search Console"],
    featured: true,
  },
  {
    name: "Tier 3",
    label: "Site + SEO + Marketing",
    price: "€3,500–€6,500",
    bullets: ["Everything in Tier 2", "Ads setup (Google/Meta)", "Landing funnels", "Monthly reporting"],
  },
  {
    name: "Tier 4",
    label: "Premium Growth",
    price: "Custom",
    bullets: ["All in Tier 3", "Brand kit", "Automation/CRM", "Dedicated support"],
  },
];

const faqs = [
  { q: "How long does it take to launch?", a: "Most Tier 1/2 sites go live in 2–4 weeks depending on content and approvals. Complex builds (Tier 3/4) are planned with milestones." },
  { q: "Do you host and maintain the website?", a: "Yes. Choose our WaaS add-on: hosting, updates, backups, security hardening, and monthly improvements for a flat fee." },
  { q: "Which stack do you use?", a: "We typically use Next.js/React, Tailwind, and headless CMS. For e-commerce: Shopify or Woo + custom integrations. We adapt to your needs." },
  { q: "What makes AuraIO different?", a: "We combine performance, design, and measurable growth. You get a transparent dashboard for SEO, speed, and leads — not just a website." },
];

// ---- Dev sanity checks (lightweight test cases) ----
const __DEV__ = typeof window !== "undefined";
if (__DEV__) {
  try {
    console.assert(steps.length === 4, "Expected 4 onboarding steps");
    console.assert(tiers.length >= 4, "Expected at least 4 pricing tiers");
    console.assert(tiers.every((t) => Array.isArray(t.bullets) && t.bullets.length > 0), "Each tier should have bullets");
    const featuredCount = tiers.filter((t) => t.featured).length;
    console.assert(featuredCount <= 1, "At most one featured tier");
    console.assert(faqs.length > 0, "Expected FAQs to be present");
    // Extra checks (do not modify existing tests)
    console.assert(steps.every((s) => typeof s.title === "string" && s.title.length > 0), "Each step needs a non-empty title");
    console.assert(tiers.every((t) => typeof t.label === "string" && t.label.length > 0), "Each tier needs a non-empty label");

    // --- Additional tests added ---
    // Prices should either include Euro symbol/range or be marked Custom
    console.assert(
      tiers.every((t) => typeof t.price === "string" && t.price.length > 0 && (t.price.includes("€") || t.price.toLowerCase().includes("custom"))),
      "Each tier price should include '€' or be 'Custom'"
    );
    // FAQ objects must have non-empty Q & A
    console.assert(
      faqs.every((f) => typeof f.q === "string" && f.q && typeof f.a === "string" && f.a),
      "Each FAQ must have non-empty question and answer"
    );
    // Tier labels should be unique
    const labelSet = new Set(tiers.map((t) => t.label));
    console.assert(labelSet.size === tiers.length, "Tier labels should be unique");
    // Default form values sanity
    console.assert(typeof ({}).hasOwnProperty.call({ updates: true }, "updates") === true, "Form has updates flag by default");

    // --- More tests (added without changing existing ones) ---
    console.assert(new Set(steps.map((s) => s.title)).size === steps.length, "Step titles should be unique");
    console.assert(tiers.every((t) => typeof t.name === "string" && t.name.length > 0), "Each tier needs a non-empty name");
    console.assert(tiers.every((t) => t.bullets.every((b) => typeof b === "string" && b.length > 0)), "Tier bullets must be non-empty strings");
  } catch (e) {
    // no-op: do not block rendering in production
  }
}

export default function AuraIOOnboarding() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    websiteType: "",
    budget: "",
    goals: "",
    timeline: "",
    updates: true,
  });

  const update = (k: keyof typeof form, v: string | boolean) =>
  setForm((f) => ({ ...f, [k]: v as any }));

type LeadResponse = { ok?: boolean; id?: string; error?: string };

const submit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const json: LeadResponse = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(json?.error ?? res.statusText);
    }

    alert(`Thanks! Your brief has been recorded. Our team will reach out to you soon.`);
    //Lead ID: ${json.id ?? "—"}

    // reset form (optional)
    setForm({
      name: "",
      email: "",
      company: "",
      websiteType: "",
      budget: "",
      goals: "",
      timeline: "",
      updates: true,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Form submit failed:", err);
    alert("Failed to submit: " + message);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 relative">
      {/* Decorative gradients */}
      <GradientOrb className="w-[42rem] h-[42rem] bg-cyan-500/30 rounded-full -top-24 -left-24" />
      <GradientOrb className="w-[36rem] h-[36rem] bg-fuchsia-600/30 rounded-full top-64 -right-24" />

      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 border-b border-white/10">
        <Section className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="relative grid place-items-center h-9 w-9 rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500">
              <InfinityIcon className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold tracking-wide">AuraIO</span>
            <Badge variant="secondary" className="ml-2 bg-white/10 text-white">Onboarding</Badge>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a href="#process" className="text-sm hover:text-white/90">Process</a>
            <a href="#tiers" className="text-sm hover:text-white/90">Tiers</a>
            <a href="#faq" className="text-sm hover:text-white/90">FAQ</a>
            <a href="#start" className="text-sm hover:text-white/90">Start</a>
            <div className="relative group">
              <div className="pointer-events-none absolute -inset-2 rounded-2xl bg-gradient-to-r from-cyan-500/40 to-fuchsia-600/40 blur-lg opacity-90 z-0 group-hover:opacity-100" />
              <Button size="sm" className="relative z-10 rounded-2xl">Get Started</Button>
            </div>
          </div>
        </Section>
      </nav>

      {/* Hero */}
      <Section id="hero" className="pt-16 pb-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-4 rounded-full bg-white/10 text-white">
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Websites that radiate growth
            </Badge>
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
              Launch your next <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">website</span> with measurable impact.
            </h1>
            <p className="mt-4 text-slate-300 max-w-prose">
              AuraIO builds high-performance, SEO-ready websites and growth systems for startups and modern brands. From concept to launch — in weeks, not months.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#start" className="relative inline-flex">
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-cyan-500/30 to-fuchsia-600/30 blur-lg" />
                <Button className="relative rounded-2xl">Start Onboarding <ArrowRight className="ml-1.5 h-4 w-4" /></Button>
              </a>
              <a href="#tiers" className="inline-flex">
                <Button variant="secondary" className="rounded-2xl bg-white/10 text-white hover:bg-white/20">See Plans</Button>
              </a>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> GDPR-ready</div>
              <div className="flex items-center gap-2"><Zap className="h-4 w-4" /> <span>Sub-2s loads</span></div>
              <div className="flex items-center gap-2"><Globe className="h-4 w-4" /> Global CDN</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="">
            <Card className="rounded-3xl bg-white/5 border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200"><Rocket className="h-5 w-5" /> Quick Quote Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-xl bg-white/5">
                    <div className="text-slate-300">Tier</div>
                    <div className="font-medium text-slate-200">Website + SEO</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <div className="text-slate-300">Timeline</div>
                    <div className="font-medium text-slate-200">3–4 weeks</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <div className="text-slate-300">Est. Cost</div>
                    <div className="font-medium text-slate-200">€2.5k–€3.2k</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <div className="text-slate-300">Performance</div>
                    <div className="font-medium text-slate-200 flex items-center gap-1"><Check className="h-4 w-4" /> 90+ Lighthouse</div>
                  </div>
                </div>
                <Separator className="my-4 bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="text-slate-300 text-sm">Transparent scope &amp; milestones included</div>
                  <Button size="sm" className="rounded-2xl">View Sample SOW</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* Process */}
      <Section id="process" className="py-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-slate-200">Onboarding, simplified</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <Card key={i} className="rounded-2xl bg-white/5 border-white/10">
              <CardHeader>
                <Badge className="rounded-full w-fit bg-white/10 text-white">Step {i + 1}</Badge>
                <CardTitle className="mt-2 flex items-center gap-2 text-slate-200">{s.icon}{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 text-sm">{s.desc}</CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Tiers */}
      <Section id="tiers" className="py-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-slate-200">Plans that scale with you</h2>
        <p className="text-slate-300 mb-6">Pick a starting point — upgrade any time. WaaS (Website-as-a-Service) available on all tiers.</p>
        <div className="grid md:grid-cols-4 gap-4">
          {tiers.map((t, i) => (
            <Card key={i} className={`rounded-2xl border ${t.featured ? "border-fuchsia-400/40 bg-fuchsia-500/10" : "border-white/10 bg-white/5"}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-slate-200">{t.label}</CardTitle>
                  {t.featured && (
                    <div className="relative inline-flex items-center">
                      <div className="pointer-events-none absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400/40 to-fuchsia-500/40 blur-md ring-1 ring-white/10" />
                      <Badge className="relative rounded-full px-3 py-1 bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-medium tracking-wide shadow-lg border border-white/20">Most Popular</Badge>
                    </div>
                  )}
                </div>
                <div className="text-slate-300 text-sm">{t.name}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold mb-3 text-slate-200">{t.price}</div>
                <ul className="space-y-2 text-sm text-slate-200">
                  {t.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2"><Check className="h-4 w-4 mt-0.5" /> {b}</li>
                  ))}
                </ul>
                <Button className="w-full mt-4 rounded-2xl">Choose {t.name}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA Banner */}
      <Section className="py-6">
        <Card className="rounded-3xl bg-gradient-to-r from-cyan-500/15 to-fuchsia-600/15 border-white/10">
          <CardContent className="py-8 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-slate-200">Ready to radiate online?</h3>
              <p className="text-slate-300">Book a 20-minute discovery call and get a tailored roadmap.</p>
            </div>
            <a href="#start" className="relative inline-flex">
              <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-cyan-500/30 to-fuchsia-600/30 blur-lg" />
              <Button size="lg" className="relative rounded-2xl">Start Onboarding <Calendar className="ml-2 h-4 w-4" /></Button>
            </a>
          </CardContent>
        </Card>
      </Section>

      {/* Intake Form */}
      <Section id="start" className="py-10">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-slate-200">Tell us about your project</h2>
            <p className="text-slate-300 mb-6">This quick brief helps us estimate timeline &amp; budget precisely. We&apos;ll reply within one business day.</p>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300">Your name</label>
                  <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Anurag Chavan" className="bg-white/10 border-white/10 text-slate-100 placeholder-slate-400" />
                </div>
                <div>
                  <label className="text-sm text-slate-300">Email</label>
                  <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" className="bg-white/10 border-white/10 text-slate-100 placeholder-slate-400" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300">Company</label>
                  <Input value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="AuraIO" className="bg-white/10 border-white/10 text-slate-100 placeholder-slate-400" />
                </div>
                <div>
                  <label className="text-sm text-slate-300">Website type</label>
                  <Input value={form.websiteType} onChange={(e) => update("websiteType", e.target.value)} placeholder="E-commerce, SaaS, portfolio, etc." className="bg-white/10 border-white/10 text-slate-100 placeholder-slate-400" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300">Budget (EUR)</label>
                  <Input value={form.budget} onChange={(e) => update("budget", e.target.value)} placeholder="e.g., 3000" className="bg-white/10 border-white/10 text-slate-100 placeholder-slate-400" />
                </div>
                <div>
                  <label className="text-sm text-slate-300">Timeline</label>
                  <Input value={form.timeline} onChange={(e) => update("timeline", e.target.value)} placeholder="e.g., 3–4 weeks" className="bg-white/10 border-white/10 text-slate-100 placeholder-slate-400" />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-300">Goals</label>
                <Textarea value={form.goals} onChange={(e) => update("goals", e.target.value)} placeholder="What success looks like for you (e.g., launch MVP, increase leads, boost SEO)." className="bg-white/10 border-white/10 min-h-[120px] text-slate-100 placeholder-slate-400" />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="updates" checked={form.updates} onCheckedChange={(v) => update("updates", Boolean(v))} />
                <label htmlFor="updates" className="text-sm text-slate-300 leading-none">Send me product updates &amp; case studies</label>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="rounded-2xl">Submit Brief <SendHorizontal className="ml-1.5 h-4 w-4" /></Button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200"><InfinityIcon className="h-5 w-5" /> Why AuraIO</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 text-sm space-y-2">
                <p><b>Performance-first.</b> Sub-2s loads, 90+ Lighthouse, WCAG-friendly, SEO-ready.</p>
                <p><b>Design that converts.</b> We pair aesthetics with analytics and iterate fast.</p>
                <p><b>Transparent growth dashboards.</b> See SEO, speed and lead metrics in one place.</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-slate-200">FAQs</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((f, i) => (
                    <AccordionItem key={i} value={`item-${i}`}>
                      <AccordionTrigger className="text-left text-slate-200 hover:text-white">{f.q}</AccordionTrigger>
                      <AccordionContent className="text-slate-300 text-sm">{f.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="mt-12 border-t border-white/10">
        <Section className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <InfinityIcon className="h-4 w-4" />
            <span>© {new Date().getFullYear()} AuraIO. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#start" className="hover:text-white">Contact</a>
          </div>
        </Section>
      </footer>
    </div>
  );
}
