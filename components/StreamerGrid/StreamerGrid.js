import React from 'react';
import Image from 'next/image';
import styles from '../../styles/StreamerGrid.module.css'


const StreamerGrid = ({channels, setChannels}) => {

  const removeChannelAction = channelId => async () => {
    console.log("Removing channel with ID: ", channelId);

    console.log('channels', channels)

    const filteredChannels = channels.filter(channel => channel.id !== channelId);

    console.log('filteredChannels', filteredChannels)

    setChannels(filteredChannels);

    const joinedChannels = filteredChannels.map(channel => channel.display_name.toLowerCase()).join(',');

    await setDBChannels(joinedChannels);
  }

  const setDBChannels = async channels => {
    try {
      const path = `https://${window.location.hostname}`;

      const response = await fetch(`${path}/api/database`, {
        method: 'POST',
        body: JSON.stringify({
          key: 'CHANNELS',
          value: channels
        })
      });

      if(response.status === 200) {
        console.log(`Set ${channels} in DB.`);
      }
    } catch (error) {
      console.warn(error.message)
    }
  }

  const renderNoItems = () => (
    <div className={styles.gridNoItems}>
      <Image layout="fill" src="https://i.giphy.com/media/5x89XRx3sBZFC/200w.webp" />
      <p>Empty list. Add a streamer to get started!</p>
    </div>
  )

  const renderGridItem = channel => (
    <div key={channel.id} className={styles.gridItem}>
    <button onClick={removeChannelAction(channel.id)}>x</button>
      <Image layout="fill" src={channel.thumbnail_url} />
      <div className={styles.gridItemContent}>
        <p>{channel.display_name}</p>
        {channel.is_live && <p>🔴 Live Now!</p>}
        {!channel.is_live && <p>⚫️ Offline</p>}
      </div>
    </div>
  );

  return (
    <div className={styles.gridContentWrapper}>
      <h2>{`✨ Julia's Twitch Dashboard ✨`}</h2>
      {channels.length > 0 && channels.map(renderGridItem)}
      {channels.length === 0 && renderNoItems()}
    </div>
  )
}


export default StreamerGrid;