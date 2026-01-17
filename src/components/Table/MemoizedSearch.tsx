import React from 'react'
import { Input } from '../ui/input';

interface IMemoizedSearchProps {
  value: string;
  onChange: (v: string) => void;
}

const MemoizedSearch = React.memo(({ value, onChange }: IMemoizedSearchProps) => {
    return (
        <Input
            placeholder="Search..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="max-w-sm bg-white"
        />
    );
});

export default MemoizedSearch;