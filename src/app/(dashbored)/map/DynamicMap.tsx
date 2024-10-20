import dynamic from 'next/dynamic';

const DynamicHereMap = dynamic(() => import('@/components/layout/Map'), {
    ssr: false,
    loading: () => <p>Loading map...</p>
});

const MapPage = () => {
    return (
        <div>
            <h1>HERE Map Example</h1>
            <DynamicHereMap apikey="YOUR_API_KEY_HERE" />
        </div>
    );
};

export default MapPage;
