"use client";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import styles from './Home.module.css';
import Link from 'next/link';
import {useState} from 'react';
import {useUserStore} from "@/app/stores/userStore.js";


function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.ruleText}>
          {props.text}
      </Modal.Body>
    </Modal>
  );
}

export default function Home() {
  const [modalShow, setModalShow] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const userStore = useUserStore();
  const handleShow = (index) => {
    setModalContent(modalData[index]);
    setModalShow(true);
  };
  const modalData = [
    {
      title: "十三支規則",
      text: (
        <>
          <p><strong>人數：</strong>4人</p>
          <p><strong>牌數：</strong>13張</p>

          <p><strong>出牌規則：</strong></p>
          <ul>
            <li><strong>三張組合大小：</strong>三條 {'>'} 一對 {'>'} 烏龍</li>
            <li><strong>五張組合大小：</strong>同花順 {'>'} 鐵支 {'>'} 葫蘆 {'>'} 同花 {'>'} 順子 {'>'} 三條 {'>'} 兩對 {'>'} 一對 {'>'} 烏龍</li>
            <li>比點數時由最大點數的牌比起，相同時比第二大的牌，依此類推</li>
            <li><strong>花色大小：</strong>黑桃 {'>'} 紅桃 {'>'} 方塊 {'>'} 梅花</li>
            <li>若牌點數相同，則比花色</li>
            <li>第一墩必須小於第二墩，第二墩必須小於或等於第三墩</li>

            <li><strong>第一墩：</strong>三張牌</li>
            <ul>
              <li><strong>牌型：</strong></li>
              <ul>
                <li><strong>烏龍：</strong>三張單張</li>
                <li><strong>一對：</strong>點數相同的兩張牌加上單張</li>
                <li><strong>三條：</strong>點數相同的三張牌</li>
              </ul>
            </ul>

            <li><strong>第二、三墩：</strong>五張牌</li>
            <ul>
              <li><strong>牌型：</strong></li>
              <ul>
                <li><strong>烏龍：</strong>五張單張</li>
                <li><strong>一對：</strong>點數相同的兩張牌加上三張單張</li>
                <li><strong>兩對：</strong>兩個一對加上一張單張</li>
                <li><strong>三條：</strong>點數相同的三張牌加上兩張單張</li>
                <li><strong>順子：</strong>點數連續的五張牌，10~A最大，1~5最小，最多只能排到10~A</li>
                <li><strong>同花：</strong>同花色的五張牌</li>
                <li><strong>葫蘆：</strong>三條加上一對</li>
                <li><strong>鐵支：</strong>點數相同的四張牌加上一張單張</li>
                <li><strong>同花順：</strong>同花色的順子</li>
              </ul>
            </ul>
          </ul>

          <p><strong>流程：</strong></p>
          <ol>
            <li>各玩家擺牌</li>
            <li>比牌</li>
          </ol>

          <p><strong>結束條件：</strong>所有玩家擺好牌</p>

          <p><strong>算分：</strong></p>
          <ul>
            <li><strong>第一墩為三條或第二、三墩為鐵支或同花順：</strong>贏過幾位玩家加幾注，輸的玩家各減1注</li>
            <li><strong>打槍：</strong>三墩都贏某位玩家，加1注，被打槍的玩家減1注</li>
            <li><strong>HomeRun：</strong>三墩都贏所有玩家，加12注，其他玩家各減4注</li>
          </ul>

          <p><strong>輸贏：</strong>依注數大小</p>
        </>

      )
    },
    {
      title: "大老二規則",
      text: (
        <>
          <p><strong>人數：</strong>4人</p>
          <p><strong>牌數：</strong>13張</p>
          <p><strong>第一輪出牌：</strong>有梅花三的玩家，梅花三必須包含在出的牌內</p>
          <p><strong>出牌規則：</strong></p>
          <ul>
            <li><strong>花色大小：</strong>黑桃 {'>'} 紅桃 {'>'} 方塊 {'>'} 梅花</li>
            <li>五張組合大小：同花順 {'>'} 鐵支 {'>'} 葫蘆 {'>'} 順子</li>
            <li>若牌點數相同，則比花色</li>
            <li>必須出和前一玩家相同數量，且牌值更高的牌</li>
            <li><strong>類型：</strong>
              <ul>
                <li><strong>單張：</strong>一張牌，最大的牌是2</li>
                <li><strong>一對：</strong>兩張牌，點數相同的兩張牌</li>
                <li><strong>順子：</strong>五張牌，點數連續的五張牌，2~6最大，1~5最小，最多只能排到10~A</li>
                <li><strong>葫蘆：</strong>五張牌，點數相同的三張牌加上一對</li>
                <li><strong>鐵支：</strong>五張牌，點數相同的四張牌加上一張單張</li>
                <li><strong>同花順：</strong>五張牌，同花色的順子</li>
              </ul>
            </li>
          </ul>

          <p><strong>流程：</strong></p>
          <ol>
            <li>玩家出牌</li>
            <li>換下一位玩家出牌</li>
            <li>沒有牌出或戰術性不出牌，該玩家說「過」或「pass」，之後在該輪不可再出牌</li>
            <li>所有其他玩家都不出牌，該輪結束，由最後出牌的玩家開始下一輪出牌</li>
          </ol>
          <p><strong>結束條件：</strong>所有玩家皆出完手牌</p>
          <p><strong>輸贏：</strong>依出完牌的先後順序</p>
        </>
      )
    },
    {
      title: "撿紅點規則",
      text: (
        <>
          <p><strong>人數：</strong>4人</p>
          <p><strong>牌數：</strong>6張</p>
          <p><strong>第一輪出牌：</strong>隨機選出1位玩家</p>
          <p><strong>公牌：</strong>由牌堆翻出4張牌，放在牌堆附近</p>
          <p><strong>吃牌：</strong></p>
          <ul>
            <li>A與9吃</li>
            <li>2與8吃</li>
            <li>3與7吃</li>
            <li>4與6吃</li>
            <li>5與5吃</li>
            <li>10與10吃</li>
            <li>J與J吃</li>
            <li>Q與Q吃</li>
            <li>K與K吃</li>
          </ul>
          <p><strong>流程：</strong></p>
          <ol>
            <li>打出一張牌</li>
            <li>和公牌配對，可以吃，擇一吃，並將牌收回</li>
            <li>從牌堆翻出一張牌</li>
            <li>和公牌配對，可以吃，擇一吃，並將牌收回</li>
          </ol>
          <p><strong>結束條件：</strong>所有牌都被收回</p>
          <p><strong>算分：</strong></p>
          <ul>
            <li>紅色的牌或A才有分數</li>
            <li>紅桃A、方塊A為20分</li>
            <li>紅2至8分別為2至8分</li>
            <li>紅9至K各為10分</li>
            <li>黑桃A為30分</li>
            <li>梅花A為40分</li>
            <li>以紅5吃紅5為雙紅五，其他玩家需再給10分</li>
          </ul>
          <p><strong>標準分：</strong>70分</p>
          <p><strong>計分：</strong>每位玩家總分減去標準分</p>
          <p><strong>輸贏：</strong>依分數高低</p>
        </>
      )
    }

  ];
  return (
    <div className={styles.container}>
      <img src="/welcome-background.jpg" alt="background" className={styles.background}/>
      <div className={styles.title}>PokerPoker</div>
      <div className={styles.info}>
        <div className={styles.intro}>
          The universe's Best poker game platform.
        </div>
        <div className={styles.button}>
          <Link href={userStore.isLogin() ? "/lobby" : "/login"}>
            <button className={styles.btn}>
              PLAY NOW
            </button>
          </Link>
        </div>
      </div>
      <div className={styles.gameinfo}>
        <Card className={styles.card}>
          <Card.Header as="h2">十三支</Card.Header>
        <Card.Body>
          <Card.Text>
            十三支是一種撲克遊戲，通常由四個人一同遊玩，每位玩家會拿到十三張牌，需要排出三墩，第一墩有三張，第二、三敦則各有五張，根據每一墩的大小決定輸贏。
          </Card.Text>
          <Button variant="secondary" onClick={() => handleShow(0)}>details</Button>
        </Card.Body>
      </Card>
        <Card className={styles.card}>
          <Card.Header as="h2">大老二</Card.Header>
          <Card.Body>
            <Card.Text>
              十三支是一種撲克遊戲，通常由四個人一同遊玩，每位玩家會拿到十三張牌，有梅花三的玩家先出牌，直到先出完手牌者獲勝。
            </Card.Text>
            <Button variant="secondary" onClick={() => handleShow(1)}>details</Button>
          </Card.Body>
        </Card>
        <Card className={styles.card}>
          <Card.Header as="h2">撿紅點</Card.Header>
          <Card.Body>
            <Card.Text>
              撿紅點是一種撲克遊戲，通常由四個人一同遊玩，每位玩家會拿到六張牌，且桌上會亮出四張牌，根據吃牌分數算出輸贏。
            </Card.Text>
            <Button variant="secondary" onClick={() => handleShow(2)}>details</Button>
          </Card.Body>
        </Card>
        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          title={modalContent.title}
          text={modalContent.text}
        />
      </div>
    </div>
  );
}
