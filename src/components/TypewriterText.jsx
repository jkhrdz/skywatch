import { useEffect, useState } from 'react';

// How long each letter takes to disappear or appear.
export const LETTER_MS = 60;

/**
 * Shows `text`. When `text` changes, the old word is erased one letter at a time,
 * then the new word is typed one letter at a time.
 *
 * `classNameFor(word)` picks a CSS class for the word currently on screen,
 * so the old word keeps its colour while it is being erased.
 */
export default function TypewriterText({ text, classNameFor = () => '' }) {
  // shown: the letters on screen right now. word: the word being erased or typed.
  const [{ shown, word }, setState] = useState({ shown: text, word: text });

  const busy = shown !== text || word !== text;

  useEffect(() => {
    if (!busy) return undefined;

    // One tick per letter until the new word is fully typed.
    const timer = setInterval(() => {
      setState((current) => {
        if (current.word !== text) {
          // Erasing the old word. Once it is empty, start typing the new one.
          const fewer = current.shown.slice(0, -1);
          return { shown: fewer, word: fewer === '' ? text : current.word };
        }
        if (current.shown === text) return current; // finished
        // Typing the new word.
        return { shown: text.slice(0, current.shown.length + 1), word: text };
      });
    }, LETTER_MS);

    return () => clearInterval(timer);
  }, [busy, text]);

  const className = [classNameFor(word), busy && 'typewriter--busy'].filter(Boolean).join(' ');

  return (
    <span className={className}>
      {/* Screen readers read this copy, so they hear the final word, not every letter. */}
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
