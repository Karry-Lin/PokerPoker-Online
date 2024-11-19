import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from './Page.module.css';

const ChinesePoker = ({ prop }) => {
  const { roomRef, roomData, players, uid } = prop;
  
  // Game state
  const [handCards, setHandCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [placedCards, setPlacedCards] = useState({
    row1: [], // 3 cards
    row2: [], // 5 cards
    row3: [], // 5 cards
  });
  const [currentRow, setCurrentRow] = useState('row1');
  const [timeLeft, setTimeLeft] = useState(40);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [allPlayersCards, setAllPlayersCards] = useState({});
  const [gameEnded, setGameEnded] = useState(false);

  // Row configurations
  const rowConfigs = {
    row1: { max: 3, label: 'Top Row' },
    row2: { max: 5, label: 'Middle Row' },
    row3: { max: 5, label: 'Bottom Row' },
  };

  // Initialize player's hand
  useEffect(() => {
    if (players && uid) {
      const currentPlayer = players.find((player) => player.id === uid);
      if (currentPlayer) {
        setHandCards(currentPlayer.handCards || []);
      }
    }
  }, [players, uid]);

  // Timer effect
  useEffect(() => {
    if (!isSubmitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleRandomSubmit();
    }
  }, [timeLeft, isSubmitted]);

  // Monitor all players' submissions
  useEffect(() => {
    const checkAllSubmissions = async () => {
      if (roomRef) {
        const docSnap = await getDoc(roomRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const allSubmitted = Object.values(data.players).every(
            (player) => player.submittedCards
          );
          
          if (allSubmitted) {
            setAllPlayersCards(
              Object.fromEntries(
                Object.entries(data.players).map(([id, player]) => [
                  id,
                  player.submittedCards,
                ])
              )
            );
            setGameEnded(true);
            alert('End game');
          }
        }
      }
    };

    const interval = setInterval(checkAllSubmissions, 1000);
    return () => clearInterval(interval);
  }, [roomRef]);

  const handleCardClick = (card) => {
    if (isSubmitted) return;
    
    setSelectedCards((prev) =>
      prev.includes(card)
        ? prev.filter((c) => c !== card)
        : [...prev, card]
    );
  };

  const handlePutCards = () => {
    if (selectedCards.length === 0) return;

    setPlacedCards((prev) => ({
      ...prev,
      [currentRow]: [...prev[currentRow], ...selectedCards],
    }));

    setHandCards((prev) =>
      prev.filter((card) => !selectedCards.includes(card))
    );
    setSelectedCards([]);

    // Move to next row if current row is full
    if (placedCards[currentRow].length + selectedCards.length >= rowConfigs[currentRow].max) {
      if (currentRow === 'row1') setCurrentRow('row2');
      else if (currentRow === 'row2') setCurrentRow('row3');
    }
  };

  const handleRandomSubmit = () => {
    const remaining = [...handCards];
    const randomPlacement = {
      row1: remaining.splice(0, 3),
      row2: remaining.splice(0, 5),
      row3: remaining.splice(0, 5),
    };
    setPlacedCards(randomPlacement);
    handleSubmit(randomPlacement);
  };

  const handleSubmit = async (finalCards = placedCards) => {
    if (roomRef) {
      try {
        await updateDoc(roomRef, {
          [`players.${uid}.submittedCards`]: finalCards,
        });
        setIsSubmitted(true);
      } catch (error) {
        console.error('Error submitting cards:', error);
      }
    }
  };

  const renderPlayerBlock = (position, playerData) => {
    const avatar = playerData?.avatar || '/default-avatar.png';
    return (
      <div className={styles[`${position}Block`]}>
        <img className={styles.avatar} src={avatar} alt="Player avatar" />
        <div className={styles.cardRows}>
          {['row1', 'row2', 'row3'].map((row) => (
            <div key={row} className={styles.cardRow}>
              {(gameEnded ? playerData?.submittedCards?.[row] : Array(rowConfigs[row].max)).map(
                (card, index) => (
                  <img
                    key={index}
                    src={`/cards/${gameEnded ? card : 0}.png`}
                    alt={`Card ${card || 0}`}
                    className={styles.card}
                  />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.gameBoard}>
        {/* Timer */}
        <div className={styles.timer}>Time left: {timeLeft}s</div>

        {/* Player blocks */}
        {!isSubmitted ? (
          <>
            <div className={styles.placementArea}>
              {Object.entries(rowConfigs).map(([row, config]) => (
                <div key={row} className={styles.cardRow}>
                  <div className={styles.cards}>
                    {placedCards[row].map((card, index) => (
                      <img
                        key={index}
                        src={`/cards/${card}.png`}
                        alt={`Card ${card}`}
                        className={styles.card}
                      />
                    ))}
                  </div>
                  {placedCards[row].length < config.max && currentRow === row && (
                    <button
                      className={styles.putButton}
                      onClick={handlePutCards}
                      disabled={selectedCards.length === 0}
                    >
                      Put
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.handArea}>
              {handCards.map((card, index) => (
                <div
                  key={index}
                  className={`${styles.card} ${
                    selectedCards.includes(card) ? styles.selected : ''
                  }`}
                  onClick={() => handleCardClick(card)}
                >
                  <img src={`/cards/${card}.png`} alt={`Card ${card}`} />
                </div>
              ))}
            </div>

            {Object.values(placedCards).every(
              (row, index) => row.length === rowConfigs[`row${index + 1}`].max
            ) && (
              <button
                className={styles.submitButton}
                onClick={() => handleSubmit()}
              >
                Submit
              </button>
            )}
          </>
        ) : (
          <div className={styles.playerBlocks}>
            {renderPlayerBlock('top', players[0])}
            {renderPlayerBlock('left', players[1])}
            {renderPlayerBlock('right', players[2])}
            {renderPlayerBlock('bottom', players[3])}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChinesePoker;