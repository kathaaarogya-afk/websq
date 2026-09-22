"use client";

import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { FaXTwitter, FaFacebookF, FaWhatsapp } from "react-icons/fa6";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `https://www.websq.com.au/stories/${slug}`;
  const text = `Read "${title}" on WebSQ`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 mr-1">
        <Share2 size={14} />
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center transition-all"
        aria-label="Share on X"
      >
        <FaXTwitter size={14} />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all"
        aria-label="Share on Facebook"
      >
        <FaFacebookF size={14} />
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all"
        aria-label="Share on WhatsApp"
      >
        <FaWhatsapp size={14} />
      </a>
      <button
        onClick={copyLink}
        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-yellow-500 hover:text-white flex items-center justify-center transition-all"
        aria-label="Copy link"
      >
        {copied ? <Check size={14} /> : <Link2 size={14} />}
      </button>
    </div>
  );
}
