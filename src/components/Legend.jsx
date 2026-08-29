function Legend({ visiblePower, togglePower }) {

    const items = [
        { label: "95～100", className: "power6" },
        { label: "90～94", className: "power5" },
        { label: "80～89", className: "power4" },
        { label: "70～79", className: "power3" },
        { label: "60～69", className: "power2" },
        { label: "50～59", className: "power1" }
    ];

    return (
        <div className="legend">
            <h3>クラブパワー</h3>

            {items.map((item) => (
                <div
                    className="legend-item"
                    key={item.className}
                    onClick={() => togglePower(item.className)}
                >
                    <div
                        className={`legend-color ${item.className}`}
                        style={{
                            opacity: visiblePower.includes(item.className) ? 1 : 0.3
                        }}
                    />

                    <span
                        style={{
                            color: visiblePower.includes(item.className)
                                ? "black"
                                : "#999"
                        }}
                    >
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default Legend;