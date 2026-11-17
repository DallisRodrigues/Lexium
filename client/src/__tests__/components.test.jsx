import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Picture from '../components/Picture.jsx';
import Logo from '../components/Logo.jsx';
import Journey from '../components/Journey.jsx';
import { SLUG_TO_SERVICE, SERVICE_OPTIONS, INDUSTRY_OPTIONS } from '../components/EnquiryForm.jsx';
import { QUESTIONS } from '../components/Diagnostic.jsx';

describe('components', () => {
  it('Picture shows a labelled placeholder (never a broken image) when the file is not yet supplied', () => {
    render(<Picture image={{ src: '/images/not-yet-downloaded', alt: 'Cleanroom' }} />);
    expect(screen.getByRole('img', { name: 'Cleanroom' }).tagName).toBe('DIV');
  });
  it('Logo uses the supplied file from public/brand (never a recreated wordmark)', () => {
    render(<Logo />);
    expect(screen.getByRole('img', { name: 'Lexium Consulting' }).getAttribute('src')).toMatch(/^\/brand\/lexium-logo\.(svg|png|webp)$/);
  });
  it('Journey renders every step in order', () => {
    render(<MemoryRouter><Journey steps={['Decide', 'Enter', 'Comply']} label="Model" /></MemoryRouter>);
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['01Decide', '02Enter', '03Comply']);
  });
});

describe('form configuration', () => {
  it('every service page slug maps to a contact-form service option', () => {
    Object.values(SLUG_TO_SERVICE).forEach((s) => expect(SERVICE_OPTIONS).toContain(s));
    expect(Object.keys(SLUG_TO_SERVICE)).toHaveLength(7);
  });
  it('industry options are the five industries plus Other — no pharmaceuticals', () => {
    expect(INDUSTRY_OPTIONS).toHaveLength(6);
    expect(INDUSTRY_OPTIONS.join(' ')).not.toMatch(/pharma/i);
  });
  it('diagnostic has the five scored areas', () => {
    expect(QUESTIONS.map((q) => q.area)).toEqual(['Growth', 'Economics', 'Governance', 'Narrative', 'Diligence']);
  });
});
