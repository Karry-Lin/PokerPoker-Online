// export default renderPlayerBlock(position, playerData){
//     const avatar = playerData?.avatar || '/default-avatar.png';
//     return (
//       <div className={styles[`${position}Block`]}>
//         <img className={styles.avatar} src={avatar} alt='Player avatar' />
//         <div className={styles.cardRows}>
//           {['row1', 'row2', 'row3'].map((row) => (
//             <div key={row} className={styles.cardRow}>
//               {(gameEnded
//                 ? playerData?.submittedCards?.[row]
//                 : Array(rowConfigs[row].max).fill(null)
//               ).map((card, index) => (
//                 <img
//                   key={index}
//                   src={`/cards/${gameEnded ? card : 0}.jpg`}
//                   alt={`Card ${card || 0}`}
//                   className={styles.card}
//                 />
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
// }