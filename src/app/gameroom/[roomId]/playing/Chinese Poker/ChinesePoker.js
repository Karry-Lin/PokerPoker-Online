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
    row3: [] // 5 cards
  });
  const [currentRow, setCurrentRow] = useState('row1');
  const [timeLeft, setTimeLeft] = useState(120);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [allPlayersCards, setAllPlayersCards] = useState({});
  const [gameEnded, setGameEnded] = useState(false);

  // Row configurations
  const rowConfigs = {
    row1: { max: 3, label: 'Top Row' },
    row2: { max: 5, label: 'Middle Row' },
    row3: { max: 5, label: 'Bottom Row' }
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
                  player.submittedCards
                ])
              )
            );
            setGameEnded(true);
          }
        }
      }
    };
    const interval = setInterval(checkAllSubmissions, 1000);
    return () => clearInterval(interval);
  }, [roomRef]);

  const handleCardClick = (card) => {
    if (isSubmitted) return;

    // Toggle card selection
    setSelectedCards((prev) =>
      prev.includes(card) ? prev.filter((c) => c !== card) : [...prev, card]
    );
  };

  const handlePutCards = (row) => {
    if (selectedCards.length === 0) return;

    // Check if adding selected cards would exceed the row's maximum
    const newRowLength = placedCards[row].length + selectedCards.length;
    if (newRowLength > rowConfigs[row].max) {
      alert(
        `Can only place ${rowConfigs[row].max} cards in ${rowConfigs[row].label}`
      );
      return;
    }

    // Update placed cards
    setPlacedCards((prev) => ({
      ...prev,
      [row]: [...prev[row], ...selectedCards]
    }));

    // Remove placed cards from hand
    setHandCards((prev) =>
      prev.filter((card) => !selectedCards.includes(card))
    );

    // Clear selection
    setSelectedCards([]);
  };

  const handleRandomSubmit = () => {
    const remaining = [...handCards];
    const randomPlacement = {
      row1: remaining.splice(0, 3),
      row2: remaining.splice(0, 5),
      row3: remaining.splice(0, 5)
    };
    setPlacedCards(randomPlacement);
    handleSubmit(randomPlacement);
  };

  const handleSubmit = async (finalCards = placedCards) => {
    // Validate all rows are properly filled
    if (!isValidPlacement(finalCards)) {
      alert('Please fill all rows with the correct number of cards');
      return;
    }

    if (roomRef) {
      try {
        await updateDoc(roomRef, {
          [`players.${uid}.submittedCards`]: finalCards
        });
        setIsSubmitted(true);
      } catch (error) {
        console.error('Error submitting cards:', error);
      }
    }
  };

  const isValidPlacement = (cards) => {
    return (
      cards.row1.length === rowConfigs.row1.max &&
      cards.row2.length === rowConfigs.row2.max &&
      cards.row3.length === rowConfigs.row3.max
    );
  };

  const renderPlayerBlock = (position, playerData) => {
    const avatar = playerData?.avatar || '/default-avatar.png';
    return (
      <div className={styles[`${position}Block`]}>
        <img className={styles.avatar} src={avatar} alt='Player avatar' />
        <div className={styles.cardRows}>
          {['row1', 'row2', 'row3'].map((row) => (
            <div key={row} className={styles.cardRow}>
              {(gameEnded
                ? playerData?.submittedCards?.[row]
                : Array(rowConfigs[row].max).fill(null)
              ).map((card, index) => (
                <img
                  key={index}
                  src={`/cards/${gameEnded ? card : 0}.jpg`}
                  alt={`Card ${card || 0}`}
                  className={styles.card}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.gameBoard}>
        {!isSubmitted ? (
          <>
            <div className={styles.timer}>Time left: {timeLeft}s</div>
            <div className={styles.placementArea}>
              {Object.entries(rowConfigs).map(([row, config]) => (
                <div
                  key={row}
                  className={`${styles.cardRow} ${
                    currentRow === row ? styles.activeRow : ''
                  }`}
                >
                  <div className={styles.rowLabel}>{config.label}</div>
                  <div className={styles.cards}>
                    {placedCards[row].map((card, index) => (
                      <img
                        key={index}
                        src={`/cards/${card}.png`}
                        alt={`Card ${card}`}
                        className={styles.card}
                      />
                    ))}
                    {/* Show empty slots */}
                    {Array(config.max - placedCards[row].length)
                      .fill(null)
                      .map((_, index) => (
                        <div
                          key={`empty-${index}`}
                          className={styles.emptySlot}
                        />
                      ))}
                  </div>
                  <button
                    className={styles.putButton}
                    onClick={() => handlePutCards(row)}
                    disabled={selectedCards.length === 0}
                  >
                    Put in {config.label}
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.cardRowWrapper}>
              <div className={styles.handCards}>
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
            </div>

            {isValidPlacement(placedCards) && (
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
