import React, { useEffect, useState, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import { MapPin, CheckCircle, XCircle, UserPlus } from 'lucide-react'

interface Checkpoint {
    id: number
    position: [number, number]
    name: string
}

const checkpoints: Checkpoint[] = [
    { id: 1, position: [51.505, -0.09], name: 'London Checkpoint' },
    { id: 2, position: [53.480, -2.242], name: 'Manchester Checkpoint' },
    { id: 3, position: [55.953, -3.188], name: 'Edinburgh Checkpoint' },
    { id: 4, position: [52.486, -1.890], name: 'Birmingham Checkpoint' },
]

const createIcon = (color: string) => L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 15px rgba(0,0,0,0.4);"></div>`,
    iconSize: [30, 30],
})

const AnimatedMarker = motion(Marker)

const MapWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 75%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border: 8px solid #ffffff;
  
  @media (min-width: 768px) {
    padding-bottom: 56.25%;
  }

  .leaflet-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f0f4f8;
    transition: filter 0.3s ease-in-out;
  }

  .custom-popup .leaflet-popup-content-wrapper {
    background: rgba(255, 255, 255, 0.95);
    color: #333;
    border-radius: 15px;
    padding: 15px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  }

  .custom-popup .leaflet-popup-tip {
    background: rgba(255, 255, 255, 0.95);
  }

  .custom-popup .leaflet-popup-content {
    margin: 10px 15px;
    font-family: 'Arial', sans-serif;
  }
`

const StatusCard = styled(motion.div)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-width: 300px;
  width: 100%;

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    max-width: calc(100% - 20px);
  }
`

const Legend = styled(motion.div)`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  @media (max-width: 768px) {
    bottom: 10px;
    left: 10px;
  }
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`

const LegendColor = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 10px;
`

const SignUpOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`

const SignUpButton = styled(motion.button)`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 18px;
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: #45a049;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`

const AutoZoom: React.FC<{ checkpoints: Checkpoint[] }> = ({ checkpoints }) => {
    const map = useMap()

    useEffect(() => {
        if (map && checkpoints.length > 0) {
            const bounds = L.latLngBounds(checkpoints.map(cp => cp.position))
            map.fitBounds(bounds, { padding: [50, 50] })
        }
    }, [map, checkpoints])

    return null
}

const Map: React.FC = () => {
    const [activeCheckpoint, setActiveCheckpoint] = useState<number | null>(null)
    const controls = useAnimation()
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [showSignUp, setShowSignUp] = useState(false)
    const mapRef = useRef<L.Map | null>(null)

    const handleMarkerClick = useCallback((id: number) => {
        setActiveCheckpoint(id)
    }, [])

    useEffect(() => {
        controls.start({
            scale: [1, 1.2, 1],
            transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
        })

        if (isFirstLoad && mapRef.current) {
            setTimeout(() => {
                setIsFirstLoad(false)
                const randomCheckpoint = checkpoints[Math.floor(Math.random() * checkpoints.length)]
                setActiveCheckpoint(randomCheckpoint.id)
                mapRef.current?.setView(randomCheckpoint.position, 10)
            }, 2000)
        }

        const timer = setTimeout(() => {
            setShowSignUp(true)
        }, 3000)

        return () => clearTimeout(timer)
    }, [controls, isFirstLoad])

    const activeCheckpointData = activeCheckpoint ? checkpoints.find(cp => cp.id === activeCheckpoint) : null

    return (
        <MapWrapper
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <MapContainer center={[54.5, -4]} zoom={5} style={{ height: '100%', width: '100%' }} ref={mapRef}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {checkpoints.map((checkpoint) => (
                    <AnimatedMarker
                        key={checkpoint.id}
                        position={checkpoint.position}
                        icon={createIcon(activeCheckpoint === checkpoint.id ? '#4CAF50' : '#2196F3')}
                        eventHandlers={{
                            click: () => handleMarkerClick(checkpoint.id),
                        }}
                        animate={controls}
                    >
                        <Popup className="custom-popup">
                            <strong>{checkpoint.name}</strong>
                            <br />
                            <span style={{ color: activeCheckpoint === checkpoint.id ? '#4CAF50' : '#2196F3' }}>
                                Status: {activeCheckpoint === checkpoint.id ? 'Active' : 'Inactive'}
                            </span>
                        </Popup>
                    </AnimatedMarker>
                ))}
                {isFirstLoad && <AutoZoom checkpoints={checkpoints} />}
            </MapContainer>
            <StatusCard
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                <h3 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <MapPin size={20} style={{ marginRight: '5px' }} /> Checkpoint Status
                </h3>
                {activeCheckpointData ? (
                    <>
                        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                            {activeCheckpointData.name}
                        </p>
                        <p style={{ color: '#4CAF50', display: 'flex', alignItems: 'center' }}>
                            <CheckCircle size={16} style={{ marginRight: '5px' }} /> Active
                        </p>
                    </>
                ) : (
                    <p style={{ color: '#757575', display: 'flex', alignItems: 'center' }}>
                        <XCircle size={16} style={{ marginRight: '5px' }} /> No active checkpoint
                    </p>
                )}
            </StatusCard>
            <Legend
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
            >
                <h4 style={{ marginBottom: '10px' }}>Legend</h4>
                <LegendItem>
                    <LegendColor color="#4CAF50" />
                    <span>Active Checkpoint</span>
                </LegendItem>
                <LegendItem>
                    <LegendColor color="#2196F3" />
                    <span>Inactive Checkpoint</span>
                </LegendItem>
            </Legend>
            <AnimatePresence>
                {showSignUp && (
                    <SignUpOverlay
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <SignUpButton
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <UserPlus size={24} />
                            Sign Up Now
                        </SignUpButton>
                    </SignUpOverlay>
                )}
            </AnimatePresence>
        </MapWrapper>
    )
}

export default Map