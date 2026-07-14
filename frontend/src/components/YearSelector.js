import { useRef, useCallback, useState, useEffect } from "react";

const CURRENT_SEASON = new Date().getFullYear();
const MIN_SEASON = 1950;
const VISIBLE_RANGE = 2;
const DEBOUNCE_MS = 600;
// const [editing, setEditing] = useState(false);
// const [inputValue, setInputValue] = useState(String(year));
// How long to wait after the last spin/drag before actually fetching new data
// Raised from 350 to 600 — gives a bit more breathing room before committing

function YearSelector({ year, onChange }) {
    const [displayYear, setDisplayYear] = useState(year);
    const debounceRef = useRef(null);
    const dragState = useRef({ dragging: false, startX: 0, startYear: year });
    const containerRef = useRef(null);
    const displayYearRef = useRef(displayYear);
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState(String(year));
    // Mirrors displayYear so the native wheel listener always reads the latest value
    // without needing to re-attach the listener on every render

    useEffect(() => {
        setDisplayYear(year);
    }, [year]);

    useEffect(() => {
        displayYearRef.current = displayYear;
    }, [displayYear]);

    const clamp = (y) => Math.min(CURRENT_SEASON, Math.max(MIN_SEASON, y));

    const scheduleCommit = (y) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => onChange(y), DEBOUNCE_MS);
    };

    const setYearImmediate = (y) => {
        const clamped = clamp(y);
        setDisplayYear(clamped);
        scheduleCommit(clamped);
    };

    // Native (non-passive) wheel listener so preventDefault actually stops page scroll
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const onWheelNative = (e) => {
            e.preventDefault();
            const direction = e.deltaY > 0 ? -1 : 1;
            setYearImmediate(displayYearRef.current + direction);
        };

        el.addEventListener("wheel", onWheelNative, { passive: false });
        return () => el.removeEventListener("wheel", onWheelNative);
    }, []);

    const handleMouseDown = (e) => {
        dragState.current = { dragging: true, startX: e.clientX, startYear: displayYear };
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!dragState.current.dragging) return;
        const delta = e.clientX - dragState.current.startX;
        const steps = Math.round(delta / 40);
        setYearImmediate(dragState.current.startYear + steps);
    };

    const handleMouseUp = () => {
        dragState.current.dragging = false;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };

    const handleClickYear = (y) => {
        setYearImmediate(y);
    };

    const commitTypedYear = () => {
        const parsed = parseInt(inputValue, 10);
        if (!isNaN(parsed)) {
            const clamped = clamp(parsed);
            setDisplayYear(clamped);
            onChange(clamped);
            // Direct commit, no debounce — typing a year is an explicit action
        } else {
            setInputValue(String(displayYear));
            // Reset to current value if input was invalid
        }
        setEditing(false);
    };
    // Always render a fixed number of slots on each side, even if that year
    // doesn't exist (e.g. no years after CURRENT_SEASON) — keeps center truly centered
    const slots = [];
    for (let offset = -VISIBLE_RANGE; offset <= VISIBLE_RANGE; offset++) {
        const y = displayYear + offset;
        const exists = y >= MIN_SEASON && y <= CURRENT_SEASON;
        slots.push({ y, offset, exists });
    }

    return (
        <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            className="relative flex items-center justify-center gap-1 bg-surface rounded-full border border-white/10 px-6 py-3 select-none cursor-ew-resize overflow-hidden"
            style={{ width: "340px" }}
        >
            {slots.map(({ y, offset, exists }) => {
                const distance = Math.abs(offset);
                const isCenter = offset === 0;
                return (
                    <div key={offset} className="flex-1 flex items-center justify-center">
                        {exists && isCenter && editing ? (
                            <input
                                autoFocus
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ""))}
                                onBlur={commitTypedYear}
                                onKeyDown={(e) => e.key === "Enter" && commitTypedYear()}
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                className="font-display font-bold text-2xl text-f1red bg-transparent border-b border-f1red w-16 text-center focus:outline-none"
                                maxLength={4}
                            />
                        ) : exists && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isCenter) {
                                        setInputValue(String(displayYear));
                                        setEditing(true);
                                    } else {
                                        handleClickYear(y);
                                    }
                                }}
                                className={`font-display font-bold transition-all duration-150 whitespace-nowrap
                  ${isCenter
                                        ? "text-2xl text-f1red scale-110"
                                        : distance === 1
                                            ? "text-base text-white/50 hover:text-white"
                                            : "text-sm text-white/25 hover:text-white/50"
                                    }`}
                            >
                                {y}
                            </button>
                        )}
                    </div>
                );
            })}

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-f1red rounded-full" />
        </div>
    );
}

export default YearSelector;