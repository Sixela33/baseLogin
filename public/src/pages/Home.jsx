import React from 'react'
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigateTo = useNavigate()

  return (
    <div>
        <Button onClick={() => navigateTo('/login')}>Login</Button>
    </div>
  )
}
