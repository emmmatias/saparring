import React, { useState, useEffect, useContext } from 'react';
import NameInput from '../components/NameInput';
import InterviewSelector from '../components/InterviewSelector';
import ChatArea from '../components/ChatArea';
import Layout from '../components/Layout';
import { Container, Box } from '@mui/material';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/router';


export default function Home() {
  const [userName, setUserName] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [interviewLevel, setInterviewLevel] = useState('');
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  useEffect(() => {
    router.push('/login')
  },[])

  const handleNameSubmit = (name) => {
    setUserName(name);
  };

  const handleSelectInterview = (type, technologies, level) => {
    setInterviewType(type);
    setSelectedTechnologies(technologies);
    setInterviewLevel(level);
  };

  const handleRestart = () => {
    setUserName('');
    setInterviewType('');
    setSelectedTechnologies([]);
    setInterviewLevel('');
  };

  return (
    <Layout onRestart={handleRestart}>

    </Layout>
  );
}
