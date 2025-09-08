// components/common/YearSelect.jsx
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export default function YearSelect({ value, onChange, years }) {
  const now = new Date().getFullYear();
  const list = years ?? [now, now - 1, now - 2];
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <Wrap ref={ref}>
      <Button type="button" onClick={() => setOpen((v) => !v)}>
        {value}년 <span>▾</span>
      </Button>

      {open && (
        <Popover>
          {list.map((y) => (
            <Item
              key={y}
              $selected={y === value}
              onClick={() => { onChange(y); setOpen(false); }}
            >
              {y}
            </Item>
          ))}
        </Popover>
      )}
    </Wrap>
  );
}

/* -------- styles (최소) -------- */
const Wrap = styled.div`
  position: relative;
  display: inline-block;
`;

const Button = styled.button`
  border: 0;
  background: transparent;
  padding: 6px 4px;
  font-weight: 800;
  font-size: 14px;
  color: #111827;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;

const Popover = styled.div`
  position: absolute;
  right: 0; top: calc(100% + 8px);
  min-width: 120px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(16,24,40,.18);
  padding: 8px;
  z-index: 10;
`;

const Item = styled.div`
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 16px;
  color: #111827;
  cursor: pointer;
  &:hover { background: #f3f4f6; }
  ${(p) => p.$selected && `background:#eef2ff;`}
  &:not(:last-child) { margin-bottom: 6px; }
`;
