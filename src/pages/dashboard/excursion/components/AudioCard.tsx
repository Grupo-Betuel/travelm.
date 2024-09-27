import React, {useState, useEffect, useRef, AudioHTMLAttributes} from 'react';
import {Button, Card, CardBody, Typography} from "@material-tailwind/react";
import {PlayIcon, PauseIcon} from '@heroicons/react/24/outline';

interface AudioPlayerProps {
    src: string;
    title: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({src, title}) => {
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
            <CardBody className="p-3">
                <Typography variant="h6">{title}</Typography>
                <audio ref={audioRef} src={src} preload="metadata" hidden/>
                <div className="flex items-center space-x-4">

                    <Button onClick={togglePlayPause}
                            className='flex p-2 items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 transition duration-200'>
                        {isPlaying ? <PauseIcon className="h-5 w-5"/> : <PlayIcon className="h-5 w-5"/>}
                    </Button>
                    <div className='flex-1 mt-4'>
                        <input
                            type="range"
                            value={currentTime}
                            step="1"
                            min="0"
                            max={duration}
                            onChange={onTimeSliderChange}
                            className="w-full"
                        />
                        <div className="text-sm text-gray-700 -mt-2">

                            <Typography>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</Typography>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default AudioPlayer;
