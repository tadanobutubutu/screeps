// ErrorBoundary.jsx
import React, { useState } from 'react';

const ErrorBoundary = ({ children, fallback: FallbackComponent }) => {
    const [error, setError] = useState(null);
    const [errorInfo, setErrorInfo] = useState(null);
    const [hasError, setHasError] = useState(false);

    const componentDidCatch = (error, errorInfo) => {
        setError(error);
        setErrorInfo(errorInfo);
        setHasError(true);
    };

    const handleReload = () => {
        // This 'handleReload' method was introduced in the second version.
        // It's added here to ensure all functionality is preserved from both versions.
        window.location.reload();
    };

    if (hasError) {
        return (
            <section
                role="alert"
                aria-labelledby="error-heading"
                style={{ padding: '2rem', fontFamily: 'monospace' }}
            >
                <h1 id="error-heading" style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
                <div
                    role="region"
                    aria-label="エラーメッセージ詳細"
                    tabIndex={0}
                    style={{
                        color: '#c53030',
                        backgroundColor: '#fff5f5',
                        padding: '1rem',
                        borderRadius: '4px',
                        overflow: 'auto',
                    }}
                >
                    <pre aria-hidden="true">
                        {error && error.toString()}
                        <br />
                        {errorInfo.componentStack}
                    </pre>
                </div>
                {/* The 'button' element was included in the first version.*/}
                <button
                    onClick={handleReload}
                    style={{
                        backgroundColor: '#004b73',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    🔄 ページを再読み込み
                </button>
                {/* The following section was added in the second version.*/}
                {FallbackComponent}
            </section>
        );
    }

    return (
        <div>
            <section>{children}</section>
        </div>
    );
};

/**
 * Adds language attribute to HTML element for better screen reader support
 * Fixes REACT_015: React Language Attribute
 */
export const addLanguageAttribute = (lang = 'en') => {
    if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
    }
};

/**
 * Ensures proper table structure with thead, tbody, and th elements
 * Fixes REACT_027: React Table Structure
 */
export const createAccessibleTable = (headers, data) => {
    return (
        <table>
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} scope="col">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

/**
 * Adds proper landmark elements for better screen reader navigation
 * Fixes REACT_017: React Landmarks and REACT_025: React Unique Landmarks
 */
export const addLandmarks = (children) => {
    return (
        <>
            <header role="banner" aria-label="Site header">
                {/* Header content */}
            </header>
            <main role="main" aria-label="Main content">
                {children}
            </main>
            <footer role="contentinfo" aria-label="Site footer">
                {/* Footer content */}
            </footer>
        </>
    );
};

/**
 * Creates a single main content container that can be used in different states
 * Fixes REACT_025: React Unique Landmarks
 */
export const createMainContent = (children, isError = false) => {
    return (
        <main role="main" aria-label={isError ? "Error content" : "Main content"}>
            {children}
        </main>
    );
};

/**
 * Adds accessible names to SVG elements
 * Fixes REACT_041: React SVG Accessible Name
 */
export const createAccessibleSVG = (svgContent, title, desc, isDecorative = false) => {
    if (isDecorative) {
        return (
            <svg aria-hidden="true" focusable="false">
                {svgContent}
            </svg>
        );
    }
    return (
        <svg aria-hidden={!title} focusable="false">
            {title && <title>{title}</title>}
            {desc && <desc>{desc}</desc>}
            {svgContent}
        </svg>
    );
};

/**
 * Creates a decorative SVG element
 * Fixes REACT_041: React SVG Accessible Name
 */
export const createDecorativeSVG = (svgContent) => {
    return (
        <svg aria-hidden="true" focusable="false">
            {svgContent}
        </svg>
    );
};

/**
 * Creates proper link elements instead of fake links
 * Fixes REACT_036: React Fake Link
 */
export const createProperLink = (href, text, isExternal = false) => {
    return (
        <a
            href={href}
            target={isExternal ? '_blank' : '_self'}
            rel={isExternal ? 'noopener noreferrer' : undefined}
        >
            {text}
        </a>
    );
};

/**
 * Adds proper scope to table headers for better screen reader interpretation
 * Fixes REACT_027: React Table Structure
 */
export const enhanceTableHeaders = (headers) => {
    return headers.map((header, index) => ({
        ...header,
        scope: 'col',
        key: `header-${index}`
    }));
};

/**
 * Creates an accessible button component
 * Fixes REACT_036: React Fake Link (for button-like elements)
 */
export const createAccessibleButton = (onClick, text, type = 'button', disabled = false) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            aria-disabled={disabled}
        >
            {text}
        </button>
    );
};

/**
 * Adds proper ARIA attributes to form elements
 * Fixes REACT_017: React Landmarks (for forms)
 */
export const createAccessibleForm = (children, formId, formName) => {
    return (
        <form id={formId} name={formName} aria-labelledby={`${formId}-title`}>
            <h2 id={`${formId}-title`}>{formName}</h2>
            {children}
        </form>
    );
};

// Initialize accessibility features when component mounts
export const initAccessibility = () => {
    addLanguageAttribute();
    // Other initialization code...
};

// Call initAccessibility when appropriate in your application

export default ErrorBoundary;