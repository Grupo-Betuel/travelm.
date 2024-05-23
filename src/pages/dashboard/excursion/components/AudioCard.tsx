import React, {useState, useEffect, useRef, AudioHTMLAttributes} from 'react';
import {Button, Card, CardBody, Typography} from "@material-tailwind/react";
import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

interface AudioPlayerProps {
    src: string;
    title: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<any>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const setAudioData = () => {
                setDuration(audio.duration);
                setCurrentTime(audio.currentTime);
            };
            const setAudioTime = () => setCurrentTime(audio.currentTime);

            audio?.addEventListener('loadeddata', setAudioData);
            audio.addEventListener('timeupdate', setAudioTime);

            return () => {
                audio.removeEventListener('loadeddata', setAudioData);
                audio.removeEventListener('timeupdate', setAudioTime);
            };
        }
    }, []);

    const togglePlayPause = () => {
        const prevValue = isPlaying;
        setIsPlaying(!prevValue);
        if (!prevValue) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    };

    const onTimeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseInt(e.target.value);
        setCurrentTime(time);
        audioRef.current!.currentTime = time;
    };

    return (
        <Card>
            <CardBody>
                <Typography variant="h6">{title}</Typography>
                <audio ref={audioRef} src={src} preload="metadata" hidden />
                <Button onClick={togglePlayPause} color="blue">
                    {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
                </Button>
                <input
                    type="range"
                    value={currentTime}
                    step="1"
                    min="0"
                    max={duration}
                    onChange={onTimeSliderChange}
                    className="w-full"
                />
                <Typography>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</Typography>
            </CardBody>
        </Card>
    );
};

export default AudioPlayer;
