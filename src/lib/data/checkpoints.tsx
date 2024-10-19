// lib/data/checkpoints.ts

export interface Checkpoint {
    id: string;
    name: string;
    lat: number;
    lng: number;
    status: 'green' | 'amber' | 'red';
    details?: string;
}

export const checkpoints: Checkpoint[] = [
    {
        id: '1',
        name: 'London Bridge',
        lat: 51.5074,
        lng: -0.0877,
        status: 'green',
        details: 'All systems operational. Traffic flow normal.'
    },
    {
        id: '2',
        name: 'Tower Bridge',
        lat: 51.5055,
        lng: -0.0754,
        status: 'amber',
        details: 'Minor delays due to maintenance work.'
    },
    {
        id: '3',
        name: 'Westminster',
        lat: 51.5007,
        lng: -0.1246,
        status: 'red',
        details: 'Closed for scheduled repairs.'
    },
    {
        id: '4',
        name: 'Waterloo',
        lat: 51.5036,
        lng: -0.1149,
        status: 'green',
        details: 'Operating normally. Light traffic conditions.'
    },
    {
        id: '5',
        name: 'Kings Cross',
        lat: 51.5320,
        lng: -0.1233,
        status: 'amber',
        details: 'Moderate congestion expected during peak hours.'
    }
];