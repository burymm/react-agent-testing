import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('Homepage', () => {
  beforeEach(() => {
    render(<HomePage />);
  });

  describe('Functional Tests', () => {
    it('renders the hero attribution: "Built by Claude"', () => {
      expect(screen.getByText(/Built by Claude/i)).toBeInTheDocument();
    });

    it('renders the Anthropic attribution', () => {
      expect(screen.getByText(/an AI agent by Anthropic/i)).toBeInTheDocument();
    });

    it('describes the project as a Next.js 16 blog with JSONPlaceholder', () => {
      expect(screen.getByText(/Next\.js 16/i)).toBeInTheDocument();
      expect(screen.getByText(/JSONPlaceholder/i)).toBeInTheDocument();
    });

    it('displays team lead attribution: Mikalai Bury (burymm)', () => {
      expect(screen.getByText(/Mikalai Bury/i)).toBeInTheDocument();
      expect(screen.getByText(/burymm/i)).toBeInTheDocument();
    });

    it('displays the LLM used: Claude by Anthropic', () => {
      expect(screen.getAllByText(/Claude/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/Anthropic/i).length).toBeGreaterThanOrEqual(2);
    });

    it('has a Posts link navigating to /posts', () => {
      const postsLink = screen.getByRole('link', { name: /Posts/i });
      expect(postsLink).toHaveAttribute('href', '/posts');
    });

    it('has an About link navigating to /about', () => {
      const aboutLink = screen.getByRole('link', { name: /About/i });
      expect(aboutLink).toHaveAttribute('href', '/about');
    });
  });

  describe('Layout and Style Tests', () => {
    it('renders a section with the homepage content', () => {
      const section = screen.getByRole('main');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Regression / Cleanup Tests', () => {
    it('does not render the old template heading', () => {
      expect(screen.queryByText(/To get started, edit the page\.tsx file/i)).not.toBeInTheDocument();
    });

    it('does not render the Deploy Now button', () => {
      expect(screen.queryByRole('link', { name: /Deploy Now/i })).not.toBeInTheDocument();
    });

    it('does not render the Vercel Documentation button', () => {
      expect(screen.queryByRole('link', { name: /Documentation/i })).not.toBeInTheDocument();
    });

    it('does not render Next.js or Vercel logos', () => {
      expect(screen.queryByAltText('Next.js logo')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Vercel logomark')).not.toBeInTheDocument();
    });
  });

  describe('Architecture Tests', () => {
    it('homepage module does not contain "use client"', () => {
      // Read the source file to verify it is a Server Component
      const fs = require('fs');
      const path = require('path');
      const source = fs.readFileSync(path.join(process.cwd(), 'app/page.tsx'), 'utf-8');
      expect(source).not.toContain("'use client'");
    });
  });
});
