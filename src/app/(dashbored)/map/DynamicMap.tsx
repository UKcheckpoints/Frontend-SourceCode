import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('@/components/layout/Map'), {
    ssr: false,
});

export default DynamicMap;
