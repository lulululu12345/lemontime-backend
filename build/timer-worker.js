let timer = null;

onmessage = (e) => {
  const result = e.data
  
  if (result === 'start-timer') {
    timer = setInterval(() => {
      postMessage('tick')
    }, 1000)
  }
  if (result === 'stop-timer') {
    clearInterval(timer);
    postMessage('stopped')
  }
}