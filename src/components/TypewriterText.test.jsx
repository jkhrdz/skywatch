import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TypewriterText, { LETTER_MS } from './TypewriterText.jsx';

// The letters people see live in an aria-hidden span; screen readers get a separate, hidden copy.
function visibleText(container) {
  return container.querySelector('[aria-hidden="true"]').textContent;
}

// Move the fake clock forward by a number of letters.
function advanceLetters(count) {
  act(() => {
    vi.advanceTimersByTime(LETTER_MS * count);
  });
}

describe('TypewriterText', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the first text in full', () => {
    const { container } = render(<TypewriterText text="Delayed" />);

    expect(visibleText(container)).toBe('Delayed');
  });

  it('erases the old text, then types the new text', () => {
    const { container, rerender } = render(<TypewriterText text="Delayed" />);

    rerender(<TypewriterText text="On time" />);

    advanceLetters(3);
    expect(visibleText(container)).toBe('Dela');

    // 4 more letters erases the rest of "Delayed", then 2 letters of "On time".
    advanceLetters(4 + 2);
    expect(visibleText(container)).toBe('On');

    advanceLetters(20);
    expect(visibleText(container)).toBe('On time');
  });

  it('gives screen readers the final text straight away', () => {
    const { rerender } = render(<TypewriterText text="Delayed" />);

    rerender(<TypewriterText text="On time" />);

    expect(screen.getByText('On time', { selector: '.visually-hidden' })).toBeInTheDocument();
  });

  it('keeps the old colour while erasing and uses the new colour while typing', () => {
    const classNameFor = (word) => `colour-${word}`;
    const { container, rerender } = render(
      <TypewriterText text="Cancelled" classNameFor={classNameFor} />,
    );
    const wrapper = container.firstChild;

    expect(wrapper).toHaveClass('colour-Cancelled');

    rerender(<TypewriterText text="Boarding" classNameFor={classNameFor} />);
    advanceLetters(2);
    expect(wrapper).toHaveClass('colour-Cancelled');

    advanceLetters(30);
    expect(wrapper).toHaveClass('colour-Boarding');
    expect(wrapper).not.toHaveClass('colour-Cancelled');
  });
});
