export default function HomeTemplate({featureData, onAction}) {
    return (
        <div>
            <h1>홈 화면</h1>
            <ul>
                {featureData.map((item, index) => (
                    <li key={index}>
                        <h2>{item.label}</h2>
                        <p>{item.description}</p>
                        <button onClick={onAction}>Action</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}