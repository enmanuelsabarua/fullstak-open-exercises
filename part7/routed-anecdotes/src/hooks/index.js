import { useState } from "react";

export const useField = (type, name) => {
    const [value, setValue] = useState('');
    
    const onChange = e => {
        setValue(e.target.value);
    }

    const onReset = () => {
        setValue('');
    }

    return {
        type,
        name,
        value,
        onChange,
        onReset
    }
}