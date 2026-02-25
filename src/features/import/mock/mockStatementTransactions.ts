import { ParsedLLMTransaction } from '@/features/import/hooks/useStatementImport';

const MOCK_DATA = [
  {
    date: '2026-01-01',
    time: '16:13',
    description: 'โอนไป X3589 บจก. ทรู มันนี่ เพ++ Ref X7621 TRUE MONEY CO., LTD (ODD) หักบัญชี',
    amount: 200,
    type: 'expense'
  },
  {
    date: '2026-01-01',
    time: '16:39',
    description: "เพื่อชำระ Ref X0614 CHESTER'S FOOD CO., LTD. ชำระเงิน",
    amount: 149,
    type: 'expense'
  },
  {
    date: '2026-01-02',
    time: '13:35',
    description: 'เพื่อชำระ Ref XK156 อีฟ แอนด์ บอย-สหไท ยการ์เด้นพลาซ่า ชำระเงิน',
    amount: 189,
    type: 'expense'
  },
  {
    date: '2026-01-02',
    time: '14:09',
    description: 'โอนไป พร้อมเพย์ X8785 น.ส. ปัญญาพร ทรัพย++ โอนเงิน',
    amount: 848,
    type: 'expense'
  },
  {
    date: '2026-01-02',
    time: '14:56',
    description: 'เพื่อชำระ Ref X9481 B2S CO.,LTD. ชำระเงิน',
    amount: 263,
    type: 'expense'
  },
  {
    date: '2026-01-02',
    time: '15:31',
    description: 'เพื่อชำระ Ref X9001 โคอิ เตะ-เซ็น ทรัลสุราษฎร์ธานี (ชื่อบัญชี: บริษัท โคอิ เตะ ( ชำระเงิน',
    amount: 130,
    type: 'expense'
  },
  {
    date: '2026-01-03',
    time: '13:35',
    description: 'เพื่อชำระ Ref X3608 KRUNGSRI CARD ชำระเงิน',
    amount: 11212.74,
    type: 'expense'
  },
  {
    date: '2026-01-03',
    time: '13:35',
    description: 'โอนไป TTB X2198 นาย ทศพล ใจ++ โอนเงิน',
    amount: 1500,
    type: 'expense'
  },
  {
    date: '2026-01-03',
    time: '15:13',
    description: 'เพื่อชำระ Ref X6001 รีโนเวท คอฟฟี่ (ชื่อบัญชี: บ จก. รีโนเวท คอฟฟี่) ชำระเงิน',
    amount: 111,
    type: 'expense'
  },
  {
    date: '2026-01-04',
    time: '05:14',
    description: 'เพื่อชำระ Ref X3914 AYUDHYA CAPIT ชำระเงิน',
    amount: 1745.83,
    type: 'expense'
  },
  {
    date: '2026-01-05',
    time: '13:14',
    description: 'เพื่อชำระ Ref X9362 Aoy Red pork with ชำระเงิน',
    amount: 120,
    type: 'expense'
  },
  {
    date: '2026-01-05',
    time: '16:35',
    description: 'เพื่อชำระ Ref X4043 TOPS-C2B Suratthani ( ชื่อบัญชี: บจก. เซ็นทรัล ฟู้ด รีเทล) ชำระเงิน',
    amount: 11,
    type: 'expense'
  },
  {
    date: '2026-01-05',
    time: '18:07',
    description: 'เพื่อชำระ Ref X2001 ท๊อปส์-สุราษฎร์ธานี (ชื่อ บัญชี: บจก. เซ็นทรัล ฟู้ด รีเทล) ชำระเงิน',
    amount: 69,
    type: 'expense'
  },
  {
    date: '2026-01-05',
    time: '18:14',
    description: 'เพื่อชำระ Ref X2001 ท๊อปส์-สุราษฎร์ธานี (ชื่อ บัญชี: บจก. เซ็นทรัล ฟู้ด รีเทล) ชำระเงิน',
    amount: 59,
    type: 'expense'
  },
  {
    date: '2026-01-06',
    time: '15:39',
    description: 'เพื่อชำระ Ref X0001 โบนัสสุกี้ สาขา สหไท ยการ์เด้นพ (ชื่อบัญชี: บริษัท คุ้มคุ้ม จำกัด) ชำระเงิน',
    amount: 879,
    type: 'expense'
  },
  {
    date: '2026-01-07',
    time: '16:36',
    description: 'จาก SCB X7280 นาง อรชร ใจ++ รับโอนเงิน',
    amount: 800,
    type: 'income'
  },
  {
    date: '2026-01-07',
    time: '17:09',
    description: 'เพื่อชำระ Ref X7610 Ksher_ FITNESSANDLIFESTYLE2 ชำระเงิน',
    amount: 15,
    type: 'expense'
  },
  {
    date: '2026-01-07',
    time: '18:48',
    description: 'โอนไป X7892 นาย พงศกร วีรดิษฐก++ โอนเงิน',
    amount: 188,
    type: 'expense'
  },
  {
    date: '2026-01-07',
    time: '19:15',
    description: 'เพื่อชำระ Ref X7202 Yoguruto สาขา T0Ps CentraI Surat (ชื่อบัญชี: นาย วงศกร เกษมพันธ์ ชำระเงิน',
    amount: 59,
    type: 'expense'
  },
  {
    date: '2026-01-08',
    time: '19:19',
    description: 'โอนไป พร้อมเพย์ X5551 นาย วิชิต ราชสี++ โอนเงิน',
    amount: 100,
    type: 'expense'
  },
  {
    date: '2026-01-09',
    time: '14:20',
    description: 'เพื่อชำระ Ref X9952 ก๋วยเตี๋ยวเนื้อตุ๋นเฮียปอ (ชื่อ บัญชี: น.ส. สุกัลญา ยางเยี่ยม) ชำระเงิน',
    amount: 165,
    type: 'expense'
  },
  {
    date: '2026-01-09',
    time: '16:02',
    description: 'เพื่อชำระ Ref X3468 Ksher_ FITNESSANDLIFESTYLE2 ชำระเงิน',
    amount: 25,
    type: 'expense'
  },
  {
    date: '2026-01-09',
    time: '18:03',
    description: 'โอนไป X7892 นาย พงศกร วีรดิษฐก++ โอนเงิน',
    amount: 203,
    type: 'expense'
  },
  {
    date: '2026-01-09',
    time: '18:07',
    description: 'เพื่อชำระ Ref X7202 Yoguruto สาขา T0Ps CentraI Surat (ชื่อบัญชี: นาย วงศกร เกษมพันธ์ ชำระเงิน',
    amount: 59,
    type: 'expense'
  },
  {
    date: '2026-01-10',
    time: '10:06',
    description: 'เพื่อชำระ Ref X4436 คาเฟ่อเมซอน บจก.ส.สุรศักดิ์ ออยล์ (ชื่อบัญชี: บจก. สิริพิชชา) ชำระเงิน',
    amount: 60,
    type: 'expense'
  },
  {
    date: '2026-01-10',
    time: '13:23',
    description: 'เพื่อชำระ Ref X4011 ร้านถุงเงิน (ร้านโกปี๊ สาขา ข้างศาลากลาง) ชำระเงิน',
    amount: 150,
    type: 'expense'
  },
  {
    date: '2026-01-10',
    time: '19:44',
    description: 'เพื่อชำระ Ref X2823 SCB มณี SHOP (ร้านตำ ลาวคูขวาง) ชำระเงิน',
    amount: 617,
    type: 'expense'
  },
  {
    date: '2026-01-10',
    time: '19:48',
    description: 'จาก KTB X5442 PAPANIN PHANPANI++ รับโอนเงิน',
    amount: 617,
    type: 'income'
  },
  {
    date: '2026-01-11',
    time: '12:43',
    description: 'เพื่อชำระ Ref X1818 SCB มณี SHOP (ข้าวมัน ไก่สีทอง กะโรม15) ชำระเงิน',
    amount: 347,
    type: 'expense'
  },
  {
    date: '2026-01-11',
    time: '12:44',
    description: 'จาก KTB X5442 PAPANIN PHANPANI++ รับโอนเงิน',
    amount: 174,
    type: 'income'
  },
  {
    date: '2026-01-11',
    time: '13:05',
    description: 'โอนไป พร้อมเพย์ X4841 น.ส. ปภาณิณ พันธ์พ++ โอนเงิน',
    amount: 95,
    type: 'expense'
  },
  {
    date: '2026-01-12',
    time: '13:11',
    description: 'เพื่อชำระ Ref X9362 Aoy Red pork with ชำระเงิน',
    amount: 60,
    type: 'expense'
  },
  {
    date: '2026-01-12',
    time: '16:18',
    description: 'เพื่อชำระ Ref X2983 Ksher_ FITNESSANDLIFESTYLE2 ชำระเงิน',
    amount: 25,
    type: 'expense'
  },
  {
    date: '2026-01-12',
    time: '17:49',
    description: 'เพื่อชำระ Ref X2001 ท๊อปส์-สุราษฎร์ธานี (ชื่อ บัญชี: บจก. เซ็นทรัล ฟู้ด รีเทล) ชำระเงิน',
    amount: 55,
    type: 'expense'
  },
  {
    date: '2026-01-14',
    time: '14:04',
    description: 'เพื่อชำระ Ref X9952 ก๋วยเตี๋ยวเนื้อตุ๋นเฮียปอ (ชื่อ บัญชี: น.ส. สุกัลญา ยางเยี่ยม) ชำระเงิน',
    amount: 130,
    type: 'expense'
  },
  {
    date: '2026-01-14',
    time: '17:42',
    description: 'เพื่อชำระ Ref X4043 TOPS-C2B Suratthani ( ชื่อบัญชี: บจก. เซ็นทรัล ฟู้ด รีเทล) ชำระเงิน',
    amount: 11,
    type: 'expense'
  },
  {
    date: '2026-01-14',
    time: '18:58',
    description: 'เพื่อชำระ Ref X2001 ท๊อปส์-สุราษฎร์ธานี (ชื่อ บัญชี: บจก. เซ็นทรัล ฟู้ด รีเทล) ชำระเงิน',
    amount: 69,
    type: 'expense'
  },
  {
    date: '2026-01-14',
    time: '19:13',
    description: 'เพื่อชำระ Ref X0001 โปเตโต้ คอร์เนอร์-เซ็น ทรัลสุรา (ชื่อบัญชี: บจก. ร็อคส์ พีซี) ชำระเงิน',
    amount: 170,
    type: 'expense'
  },
  {
    date: '2026-01-15',
    time: '09:27',
    description: 'โอนไป SCB X8792 นาย ทศพล ใจ++ โอนเงิน',
    amount: 12982,
    type: 'expense'
  },
  {
    date: '2026-01-16',
    time: '12:42',
    description: 'จาก KK X7043 นาย ทศพล ใจ++ รับโอนเงิน',
    amount: 20000,
    type: 'income'
  },
  {
    date: '2026-01-16',
    time: '12:43',
    description: 'โอนไป SCB X8792 นาย ทศพล ใจ++ โอนเงิน',
    amount: 2350,
    type: 'expense'
  },
  {
    date: '2026-01-16',
    time: '14:07',
    description: 'เพื่อชำระ Ref X9952 ก๋วยเตี๋ยวเนื้อตุ๋นเฮียปอ (ชื่อ บัญชี: น.ส. สุกัลญา ยางเยี่ยม) ชำระเงิน',
    amount: 170,
    type: 'expense'
  },
  {
    date: '2026-01-16',
    time: '17:57',
    description: 'เพื่อชำระ Ref X4043 TOPS-C2B Suratthani ( ชื่อบัญชี: บจก. เซ็นทรัล ฟู้ด รีเทล) ชำระเงิน',
    amount: 11,
    type: 'expense'
  },
  {
    date: '2026-01-16',
    time: '19:07',
    description: 'เพื่อชำระ Ref X7202 Yoguruto สาขา T0Ps CentraI Surat (ชื่อบัญชี: นาย วงศกร เกษมพันธ์ ชำระเงิน',
    amount: 59,
    type: 'expense'
  },
  {
    date: '2026-01-17',
    time: '15:54',
    description: 'เพื่อชำระ Ref X0001 โบนัสสุกี้ สาขา สหไท ยการ์เด้นพ (ชื่อบัญชี: บริษัท คุ้มคุ้ม จำกัด) ชำระเงิน',
    amount: 666.61,
    type: 'expense'
  },
  {
    date: '2026-01-17',
    time: '17:45',
    description: 'เพื่อชำระ Ref X8003 MITTARE INSURANCE PUBLIC COMPANY LIMITED ชำระเงิน',
    amount: 2266.72,
    type: 'expense'
  },
  {
    date: '2026-01-17',
    time: '23:28',
    description: 'โอนไป X3589 บจก. ทรู มันนี่ เพ++ Ref X4899 TRUE MONEY CO., LTD (ODD) หักบัญชี',
    amount: 300,
    type: 'expense'
  },
  {
    date: '2026-01-18',
    time: '13:16',
    description: 'โอนไป พร้อมเพย์ X4841 น.ส. ปภาณิณ พันธ์พ++ โอนเงิน',
    amount: 200,
    type: 'expense'
  },
  {
    date: '2026-01-18',
    time: '19:24',
    description: 'เพื่อชำระ Ref X0478 CENTRAL RESTAURANTS GROUP CO.,LTD. ชำระเงิน',
    amount: 159,
    type: 'expense'
  },
  {
    date: '2026-01-20',
    time: '17:47',
    description: 'เพื่อชำระ Ref X6307 Ksher_ FITNESSANDLIFESTYLE2 ชำระเงิน',
    amount: 15,
    type: 'expense'
  },
  {
    date: '2026-01-20',
    time: '18:57',
    description: 'เพื่อชำระ Ref X0001 โปเตโต้ คอร์เนอร์-เซ็น ทรัลสุรา (ชื่อบัญชี: บจก. ร็อคส์ พีซี) ชำระเงิน',
    amount: 170,
    type: 'expense'
  },
  {
    date: '2026-01-20',
    time: '18:58',
    description: 'เพื่อชำระ Ref X2001 ท๊อปส์-สุราษฎร์ธานี (ชื่อ บัญชี: บจก. เซ็นทรัล ฟู้ด รีเทล) ชำระเงิน',
    amount: 55,
    type: 'expense'
  },
  {
    date: '2026-01-21',
    time: '11:13',
    description: 'เพื่อชำระ Ref X1613 KRUNGTHAI CARD PUBLIC COMPANY LIMITED ชำระเงิน',
    amount: 2635.26,
    type: 'expense'
  },
  {
    date: '2026-01-21',
    time: '14:05',
    description: 'เพื่อชำระ Ref X5706 ก๋วยเตี๋ยวเรือบางใหญ่ (ชื่อ บัญชี: น.ส. น้อย ทรัพย์ประเสริฐ) ชำระเงิน',
    amount: 160,
    type: 'expense'
  },
  {
    date: '2026-01-21',
    time: '14:16',
    description: 'โอนไป X3589 บจก. ทรู มันนี่ เพ++ Ref X3911 TRUE MONEY CO., LTD (ODD) หักบัญชี',
    amount: 100,
    type: 'expense'
  },
  {
    date: '2026-01-21',
    time: '17:23',
    description: 'เพื่อชำระ Ref X0991 Ksher_ FITNESSANDLIFESTYLE2 ชำระเงิน',
    amount: 15,
    type: 'expense'
  },
  {
    date: '2026-01-21',
    time: '18:36',
    description: 'เพื่อชำระ Ref X7202 Yoguruto สาขา T0Ps CentraI Surat (ชื่อบัญชี: นาย วงศกร เกษมพันธ์ ชำระเงิน',
    amount: 59,
    type: 'expense'
  },
  {
    date: '2026-01-23',
    time: '14:47',
    description: 'เพื่อชำระ Ref X9952 ก๋วยเตี๋ยวเนื้อตุ๋นเฮียปอ (ชื่อ บัญชี: น.ส. สุกัลญา ยางเยี่ยม) ชำระเงิน',
    amount: 165,
    type: 'expense'
  },
  {
    date: '2026-01-24',
    time: '13:36',
    description: 'โอนไป X3589 บจก. ทรู มันนี่ เพ++ Ref X8209 TRUE MONEY CO., LTD (ODD) หักบัญชี',
    amount: 200,
    type: 'expense'
  },
  {
    date: '2026-01-26',
    time: '15:18',
    description: 'เพื่อชำระ Ref X9952 ก๋วยเตี๋ยวเนื้อตุ๋นเฮียปอ (ชื่อ บัญชี: น.ส. สุกัลญา ยางเยี่ยม) ชำระเงิน',
    amount: 185,
    type: 'expense'
  },
  {
    date: '2026-01-27',
    time: '14:48',
    description: 'เพื่อชำระ Ref X5837 ITEMMANIATH CO LTD ชำระเงิน',
    amount: 48,
    type: 'expense'
  },
  {
    date: '2026-01-27',
    time: '17:14',
    description: 'เพื่อชำระ Ref X9T3G LINE Pay (QR by ttb) ชำระเงิน',
    amount: 416.7,
    type: 'expense'
  },
  {
    date: '2026-01-27',
    time: '18:02',
    description: 'เพื่อชำระ Ref X9176 Ksher_ FITNESSANDLIFESTYLE2 ชำระเงิน',
    amount: 15,
    type: 'expense'
  },
  {
    date: '2026-01-27',
    time: '19:08',
    description: 'เพื่อชำระ Ref X5093 CENTRAL RESTAURANTS GROUP CO.,LTD. ชำระเงิน',
    amount: 148,
    type: 'expense'
  },
  {
    date: '2026-01-28',
    time: '15:33',
    description: 'เพื่อชำระ Ref X9952 ก๋วยเตี๋ยวเนื้อตุ๋นเฮียปอ (ชื่อ บัญชี: น.ส. สุกัลญา ยางเยี่ยม) ชำระเงิน',
    amount: 145,
    type: 'expense'
  },
  {
    date: '2026-01-28',
    time: '18:23',
    description: 'เพื่อชำระ Ref X0527 Ksher_ FITNESSANDLIFESTYLE2 ชำระเงิน',
    amount: 15,
    type: 'expense'
  },
  {
    date: '2026-01-30',
    time: '15:51',
    description: 'เพื่อชำระ Ref X9952 ก๋วยเตี๋ยวเนื้อตุ๋นเฮียปอ (ชื่อ บัญชี: น.ส. สุกัลญา ยางเยี่ยม) ชำระเงิน',
    amount: 170,
    type: 'expense'
  },
  {
    date: '2026-01-30',
    time: '17:30',
    description: 'เพื่อชำระ Ref X4488 Ksher_ FITNESSANDLIFESTYLE2 ชำระเงิน',
    amount: 15,
    type: 'expense'
  },
  {
    date: '2026-01-30',
    time: '19:01',
    description: 'เพื่อชำระ Ref X0001 โปเตโต้ คอร์เนอร์-เซ็น ทรัลสุรา (ชื่อบัญชี: บจก. ร็อคส์ พีซี) ชำระเงิน',
    amount: 124,
    type: 'expense'
  },
  {
    date: '2026-01-31',
    time: '17:07',
    description: 'เพื่อชำระ Ref X5617 SCB มณี SHOP (คุณชาย ทาโกะยากิ) ชำระเงิน',
    amount: 40,
    type: 'expense'
  },
  {
    date: '2026-01-31',
    time: '19:02',
    description: 'เพื่อชำระ Ref X0001 โบนัสสุกี้ สาขา สหไท ยการ์เด้นพ (ชื่อบัญชี: บริษัท คุ้มคุ้ม จำกัด) ชำระเงิน',
    amount: 614.18,
    type: 'expense'
  },
  {
    date: '2026-02-02',
    time: '15:30',
    description: 'เพื่อชำระ Ref X0001 โบนัสสุกี้ สาขา สหไท ยการ์เด้นพ (ชื่อบัญชี: บริษัท คุ้มคุ้ม จำกัด) ชำระเงิน',
    amount: 150,
    type: 'expense'
  },
  {
    date: '2026-02-02',
    time: '21:04',
    description: 'เพื่อชำระ Ref X7314 แชปเตอร์ หาดใหญ่ (ชื่อ บัญชี: บจก. ชิน พร็อพเพอร์ตี้ แอนด์ ดีเวลลอป ชำระเงิน',
    amount: 1100,
    type: 'expense'
  },
  {
    date: '2026-02-03',
    time: '17:16',
    description: 'เพื่อชำระ Ref XHSF0 LINE Pay (QR by ttb) ชำระเงิน',
    amount: 47.8,
    type: 'expense'
  },
  {
    date: '2026-02-04',
    time: '12:27',
    description: 'จาก KK X7043 นาย ทศพล ใจ++ รับโอนเงิน',
    amount: 32614.01,
    type: "income"
  },
  {
    date: '2026-02-04',
    time: '12:28',
    description: 'โอนไป TTB X2198 นาย ทศพล ใจ++ โอนเงิน',
    amount: 1826.68,
    type: 'expense'
  },
  {
    date: '2026-02-04',
    time: '12:28',
    description: 'เพื่อชำระ Ref X3608 KRUNGSRI CARD ชำระเงิน',
    amount: 12861.64,
    type: 'expense'
  },
  {
    date: '2026-02-04',
    time: '12:29',
    description: 'เพื่อชำระ Ref X3914 AYUDHYA CAPIT ชำระเงิน',
    amount: 1745.83,
    type: 'expense'
  },
  {
    date: '2026-02-04',
    time: '18:26',
    description: 'เพื่อชำระ Ref X5738 Ksher_ FITNESSANDLIFESTYLE2 ชำระเงิน',
    amount: 25,
    type: 'expense'
  },
  {
    date: '2026-02-04',
    time: '19:21',
    description: 'เพื่อชำระ Ref X4043 TOPS-C2B Suratthani ( ชื่อบัญชี: บจก. เซ็นทรัล ฟู้ด รีเทล) ชำระเงิน',
    amount: 169,
    type: 'expense'
  },
  {
    date: '2026-02-04',
    time: '19:27',
    description: 'เพื่อชำระ Ref X2001 ท๊อปส์-สุราษฎร์ธานี (ชื่อ บัญชี: บจก. เซ็นทรัล ฟู้ด รีเทล) ชำระเงิน',
    amount: 59,
    type: 'expense'
  },
  {
    date: '2026-02-05',
    time: '13:30',
    description: 'เพื่อชำระ Ref X5706 ก๋วยเตี๋ยวเรือบางใหญ่ (ชื่อ บัญชี: น.ส. น้อย ทรัพย์ประเสริฐ) ชำระเงิน',
    amount: 160,
    type: 'expense'
  },
  {
    date: '2026-02-06',
    time: '12:48',
    description: 'เพื่อชำระ Ref X1075 SCB มณี SHOP (แบคยาร์ด คาเฟ่ เอ็กซ์ ทีซีที) ชำระเงิน',
    amount: 95,
    type: 'expense'
  },
  {
    date: '2026-02-07',
    time: '16:46',
    description: 'เพื่อชำระ Ref XC6QG LINE Pay (QR by ttb) ชำระเงิน',
    amount: 47.8,
    type: 'expense'
  },
  {
    date: '2026-02-08',
    time: '13:21',
    description: 'เพื่อชำระ Ref XTHTG LINE Pay (QR by ttb) ชำระเงิน',
    amount: 298.5,
    type: 'expense'
  },
  {
    date: '2026-02-08',
    time: '15:14',
    description: 'เพื่อชำระ Ref X0S2G LINE Pay (QR by ttb) ชำระเงิน',
    amount: 298.5,
    type: 'expense'
  },
  {
    date: '2026-02-08',
    time: '15:20',
    description: 'เพื่อชำระ Ref XP360 LINE Pay (QR by ttb) ชำระเงิน',
    amount: 298.5,
    type: 'expense'
  },
  {
    date: '2026-02-09',
    time: '20:56',
    description: 'โอนไป พร้อมเพย์ X4841 น.ส. ปภาณิณ พันธ์พ++ โอนเงิน',
    amount: 1000,
    type: 'expense'
  },
  {
    date: '2026-02-10',
    time: '17:47',
    description: 'เพื่อชำระ Ref X4043 TOPS-C2B Suratthani ( ชื่อบัญชี: บจก. เซ็นทรัล ฟู้ด รีเทล) ชำระเงิน',
    amount: 11,
    type: 'expense'
  },
  {
    date: '2026-02-10',
    time: '19:04',
    description: 'เพื่อชำระ Ref X5093 CENTRAL RESTAURANTS GROUP CO.,LTD. ชำระเงิน',
    amount: 148,
    type: 'expense'
  },
  {
    date: '2026-02-11',
    time: '18:34',
    description: 'เพื่อชำระ Ref X9190 Ksher_ FITNESSANDLIFESTYLE2 ชำระเงิน',
    amount: 10,
    type: 'expense'
  },
  {
    date: '2026-02-11',
    time: '19:47',
    description: 'เพื่อชำระ Ref X2001 ท๊อปส์-สุราษฎร์ธานี (ชื่อ บัญชี: บจก. เซ็นทรัล ฟู้ด รีเทล) ชำระเงิน',
    amount: 75,
    type: 'expense'
  },
  {
    date: '2026-02-11',
    time: '20:07',
    description: 'เพื่อชำระ Ref X7202 Yoguruto สาขา T0Ps CentraI Surat (ชื่อบัญชี: นาย วงศกร เกษมพันธ์ ชำระเงิน',
    amount: 79,
    type: 'expense'
  },
  {
    date: '2026-02-12',
    time: '15:26',
    description: 'เพื่อชำระ Ref X9952 ก๋วยเตี๋ยวเนื้อตุ๋นเฮียปอ (ชื่อ บัญชี: น.ส. สุกัลญา ยางเยี่ยม) ชำระเงิน',
    amount: 185,
    type: 'expense'
  },
  {
    date: '2026-02-13',
    time: '13:36',
    description: 'เพื่อชำระ Ref X5706 ก๋วยเตี๋ยวเรือบางใหญ่ (ชื่อ บัญชี: น.ส. น้อย ทรัพย์ประเสริฐ) ชำระเงิน',
    amount: 160,
    type: 'expense'
  },
  {
    date: '2026-02-13',
    time: '18:07',
    description: 'เพื่อชำระ Ref X9873 Ksher_ FITNESSANDLIFESTYLE2 ชำระเงิน',
    amount: 15,
    type: 'expense'
  }
] as ParsedLLMTransaction[];

export const generateMockTransactions = (count: number = 10): ParsedLLMTransaction[] => {
  const shuffled = [...MOCK_DATA].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
