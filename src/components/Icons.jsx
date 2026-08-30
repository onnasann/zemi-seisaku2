import SvgIcon from "@mui/material/SvgIcon";

export function SoccerBallIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <polygon points="12,7 15.5,9.5 14,14 10,14 8.5,9.5" fill="currentColor" opacity="0.9" />
            <line x1="12" y1="7" x2="12" y2="2" stroke="currentColor" strokeWidth="1.5" />
            <line x1="15.5" y1="9.5" x2="21" y2="7.5" stroke="currentColor" strokeWidth="1.5" />
            <line x1="14" y1="14" x2="18.5" y2="19" stroke="currentColor" strokeWidth="1.5" />
            <line x1="10" y1="14" x2="5.5" y2="19" stroke="currentColor" strokeWidth="1.5" />
            <line x1="8.5" y1="9.5" x2="3" y2="7.5" stroke="currentColor" strokeWidth="1.5" />
        </SvgIcon>
    );
}

export function AnalyticsIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <path
                d="M3 13h4v8H3v-8zm6-7h4v15H9V6zm6 4h4v11h-4V10zm6-7h4v18h-4V3z"
                fill="currentColor"
            />
        </SvgIcon>
    );
}

export function SearchIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <path
                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                fill="currentColor"
            />
        </SvgIcon>
    );
}

export function CloseIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <path
                d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                fill="currentColor"
            />
        </SvgIcon>
    );
}

export function TrophyIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <path
                d="M19 3H5c-1.1 0-2 .9-2 2v2c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H8v2h8v-2h-3v-3.1c1.86-.48 3.32-1.99 3.61-3.96C19.08 11.63 21 9.55 21 7V5c0-1.1-.9-2-2-2zm-14 4V5h2v3.08C5.8 7.7 5 6.96 5 7zm14 0c0 .96-.8 1.7-2 1.08V5h2v2z"
                fill="currentColor"
            />
        </SvgIcon>
    );
}

export function TrendingUpIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <path
                d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"
                fill="currentColor"
            />
        </SvgIcon>
    );
}

export function TrendingDownIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <path
                d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"
                fill="currentColor"
            />
        </SvgIcon>
    );
}

export function InfoIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                fill="currentColor"
            />
        </SvgIcon>
    );
}

export function RefreshIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <path
                d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                fill="currentColor"
            />
        </SvgIcon>
    );
}

export function RadarIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 3" />
            <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1.2" />
            <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.2" />
        </SvgIcon>
    );
}

export function TableChartIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <path
                d="M10 10.02h5V21h-5zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H4c-1.1 0-2 .9-2 2v3h20V5c0-1.1-.9-2-2-2zM3 21h5V10.02H3V19c0 1.1.9 2 2 2z"
                fill="currentColor"
            />
        </SvgIcon>
    );
}

export function InsightsIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <path
                d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"
                fill="currentColor"
            />
        </SvgIcon>
    );
}

export function PersonIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                fill="currentColor"
            />
        </SvgIcon>
    );
}

export function HelpIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"
                fill="currentColor"
            />
        </SvgIcon>
    );
}

export function FireIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <path
                d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"
                fill="currentColor"
            />
        </SvgIcon>
    );
}
