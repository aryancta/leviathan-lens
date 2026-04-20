"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { Eye, EyeOff, ExternalLink, Key, Trash2 } from "lucide-react";

const KEYS_LS = "leviathan_lens_api_keys";

interface Keys {
  anthropic?: string;
  gemini?: string;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [keys, setKeys] = React.useState<Keys>({});
  const [show, setShow] = React.useState<{ anthropic: boolean; gemini: boolean }>({
    anthropic: false,
    gemini: false,
  });
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(KEYS_LS);
      if (raw) setKeys(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: Keys) => {
    setKeys(next);
    localStorage.setItem(KEYS_LS, JSON.stringify(next));
  };

  const clearAll = () => {
    localStorage.removeItem(KEYS_LS);
    setKeys({});
    toast({ title: "Keys cleared", tone: "default" });
  };

  const save = () => {
    persist(keys);
    toast({ title: "Keys saved locally", tone: "success" });
  };

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-10">
      <h1 className="font-serif text-4xl text-ink-900 tracking-tight">Settings</h1>
      <p className="mt-2 text-ink-600 max-w-xl">
        Paste your own API keys to enable live model reasoning. Keys live only
        in your browser's localStorage — they are never written to our server,
        never logged, never committed anywhere.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-sans">
            <Key className="h-4 w-4" /> API keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <label className="text-sm font-medium text-ink-900">
                Anthropic Claude
              </label>
              <Badge>Primary</Badge>
              <Badge className="bg-parchment-100">Sonnet 4.5</Badge>
            </div>
            <p className="text-xs text-ink-500 mb-2">
              Best reasoning over dense legal prose. Get a free key at{" "}
              <a
                className="underline underline-offset-2 text-ink-700 hover:text-ink-900"
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noreferrer"
              >
                console.anthropic.com <ExternalLink className="inline h-3 w-3" />
              </a>
              .
            </p>
            <div className="flex items-center gap-2">
              <Input
                type={show.anthropic || !mounted ? "text" : "password"}
                placeholder="sk-ant-..."
                value={keys.anthropic ?? ""}
                onChange={(e) => setKeys({ ...keys, anthropic: e.target.value })}
              />
              <Button
                variant="ghost"
                size="md"
                onClick={() => setShow((s) => ({ ...s, anthropic: !s.anthropic }))}
                aria-label={show.anthropic ? "Hide key" : "Show key"}
              >
                {show.anthropic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <label className="text-sm font-medium text-ink-900">Google Gemini</label>
              <Badge>Fallback + vision</Badge>
              <Badge className="bg-parchment-100">2.5 Flash</Badge>
            </div>
            <p className="text-xs text-ink-500 mb-2">
              Generous free tier; used when Claude rate-limits. Get a free key at{" "}
              <a
                className="underline underline-offset-2 text-ink-700 hover:text-ink-900"
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
              >
                aistudio.google.com/apikey <ExternalLink className="inline h-3 w-3" />
              </a>
              .
            </p>
            <div className="flex items-center gap-2">
              <Input
                type={show.gemini || !mounted ? "text" : "password"}
                placeholder="AIza..."
                value={keys.gemini ?? ""}
                onChange={(e) => setKeys({ ...keys, gemini: e.target.value })}
              />
              <Button
                variant="ghost"
                size="md"
                onClick={() => setShow((s) => ({ ...s, gemini: !s.gemini }))}
                aria-label={show.gemini ? "Hide key" : "Show key"}
              >
                {show.gemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-ink-100">
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <Trash2 className="h-3.5 w-3.5" /> Clear all
            </Button>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="md">
                  Back to Lens
                </Button>
              </Link>
              <Button size="md" onClick={save}>
                Save locally
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base font-sans">Demo mode</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-ink-600 space-y-2">
          <p>
            Leviathan Lens ships with a complete local analysis engine: a
            ten-tactic sludge taxonomy, a jurisdiction detector, and a deterministic
            response-letter drafter. <strong>No key is required</strong> to see the
            product end-to-end.
          </p>
          <p>
            Keys only unlock deeper model-grounded reasoning on edge cases
            (ambiguous phrasing, unusual domains, multi-language letters).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
