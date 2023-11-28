const navbarMenu = [
	{
		label: 'เกี่ยวกับ',
		yValue: 200,
		ref: '#about-comcamp-section'
	},
	{
		label: 'หัวข้ออบรม',
		ref: '#learning-section',
		yValue: 900
	},
	{
		label: 'สถิติ',
		ref: '#stats-section',
		yValue: 4500
	},
	{
		label: 'รีวิว',
		ref: '#review-section',
		yValue: 5300
	},
	{
		label: 'สิ่งที่ได้รับ',
		ref: '#benefit-section',
		yValue: 6400
	},
	{
		label: 'ไทม์ไลน์',
		ref: '#timeline-section',
		yValue: 7500
	},
	{
		label: 'คำถาม',
		ref: '#faq-section',
		yValue: 9500
	},
	{
		label: 'ติดต่อ',
		ref: '#contact-section',
		yValue: 9880
	}
];

const actionMenu = [
	{
		name: 'register',
		label: 'เข้าร่วม',
		link: '/authentication'
	}
];

const aboutComcamp =
	'ค่ายยุวชนคอมพิวเตอร์ หรือ คอมแคมป์ เป็นค่ายที่จัดขึ้นโดยสาขาวิชาวิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์ มหาวิทยาลัยแม่โจ้เพื่อเปิดโอกาสให้น้องๆที่สนใจเรียนรู้และฝึกฝนทักษะด้านคอมพิวเตอร์อย่างสนุกสนานเป็นเวลา 3 วัน 2 คืน โดยในปี พ.ศ. 2567 จัดขึ้นระหว่างวันที่ 23-25 กุมภาพันธ์ ณ มหาวิทยาลัยแม่โจ้ จังหวัดเชียงใหม่';

const learningObjectives = [
	{
		punchline: 'Mobile Development',
		body: 'น้อง ๆ เคยเล่นแอปอะไรในมือถือบ้าง? เกม เฟสบุ๊ค ไลน์ ยูทูป พวกนี้แหละคือแอปพลิเคชันมือถือทั้งนั้นเลย แล้วการพัฒนาแอปพลิเคชันมือถือก็คือการที่เรามาเรียนรู้วิธีสร้างแอปพวกนี้ขึ้นมาเอง ซึ่งทักษะนี้เป็นอะไรที่จะอินเทรนด์และต้องการเป็นอย่างมากในปัจจุบันเลยล่ะ เพราะงั้นในค่ายนี้ น้อง ๆ จะได้เรียนรู้วิธีพัฒนาแอปพลิเคชันสำหรับอุปกรณ์มือถือ เช่น สมาร์ทโฟนและแท็บเล็ต โดยใช้เครื่องมือและเทคโนโลยีที่ทันสมัย'
	},
	{
		punchline: 'IOT and Microcontroller',
		body: 'IoT ย่อมาจากคำว่า Internet of Things ซึ่งหมายถึงการเชื่อมต่ออุปกรณ์ต่างๆ เข้ากับอินเทอร์เน็ต เพื่อให้สามารถรับและส่งข้อมูลได้ เช่น เครื่องวัดอุณหภูมิอัจฉริยะ กล้องวงจรปิดอัจฉริยะ และหลอดไฟอัจฉริยะ ส่วนไมโครคอนโทรลเลอร์คืออุปกรณ์อิเล็กทรอนิกส์ที่ใช้ควบคุมการทำงานของอุปกรณ์ IoT สำหรับน้อง ๆ ที่่สนใจการสร้างโครคอนโทรลเลอร์และการเชื่อมต่อ การเรียนรู้ในค่ายนี้จะช่วยให้น้องๆ สามารถพัฒนาอุปกรณ์ IoT ของตนเองได้'
	},
	{
		punchline: 'Web Development',
		body: 'เว็บไซต์คือหน้าเพจบนอินเทอร์เน็ตที่สามารถเข้าถึงได้จากทั่วทุกมุมโลก แล้วน้อง ๆ รู้มั้ยว่าตอนนี้มีเว็บไซต์ที่ถูกสร้างแล้วประมาณ 1.13 พันล้านเว็บไซต์ ดังนั้นค่ายนี้จะมีการสอนพัฒนาเว็บไซต์ หรือการเรียนรู้วิธีการสร้างหน้าเว็บเหล่านี้ขึ้นมาเองนั่นเอง ซึ่งเป็นอีกหนึ่งทักษะที่เป็นที่ต้องการอย่างมากในปัจจุบัน เพราะเว็บไซต์เป็นเครื่องมือสำคัญในการสื่อสารและประชาสัมพันธ์ขององค์กรนั้นเอง'
	},
	{
		punchline: 'Artificial Intelligence and Data Visualization',
		body: 'AI คือสาขาหนึ่งของวิทยาการคอมพิวเตอร์ที่เกี่ยวข้องกับการพัฒนาระบบคอมพิวเตอร์ให้สามารถเรียนรู้และทำนายได้เหมือนมนุษย์ การแสดงภาพข้อมูลคือการใช้กราฟและตารางต่างๆ เพื่อนำเสนอข้อมูลให้เข้าใจง่าย การเรียนรู้เกี่ยวกับ AI และการแสดงภาพข้อมูลจะช่วยให้น้องๆ สามารถพัฒนาแอปพลิเคชันที่สามารถเรียนรู้และทำนายได้ และสามารถนำเสนอข้อมูลได้อย่างเข้าใจง่าย'
	}
];

const benefits = [
	{
		punchline: 'เรียนจากมือโปร',
		body: 'เรียนกับอาจารย์และรุ่นพี่ที่มีประสบการณ์และเชี่ยวชาญ',
		pic: new URL('$lib/assets/teacher_2.png', import.meta.url).href
	},

	{
		punchline: 'ลงมือทำจริง',
		body: 'ฝึกฝนทักษะผ่านกิจกรรมและโครงงาน',
		pic: new URL('$lib/assets/pencil.png', import.meta.url).href
	},
	{
		punchline: 'ได้เพื่อนใหม่',
		body: 'พบปะเพื่อนนักเรียนที่สนใจเกี่ยวกับคอมพิวเตอร์',
		pic: new URL('$lib/assets/people_talking.png', import.meta.url).href
	},
	{
		punchline: 'สนุกไปกับการเรียนรู้',
		body: 'เรียนรู้ด้วยวิธีการสอนที่แสนสนุก พร้อมกิจกรรมที่ตื่นเต้น',
		pic: new URL('$lib/assets/laugh.png', import.meta.url).href
	}
];

const timeline = [
	{
		date: new Date('2023-11-29'),
		title: 'เปิดรับสมัคร'
	},
	{
		date: new Date('2023-12-30'),
		title: 'ปิดรับสมัคร'
	},
	{
		date: new Date('2024-01-01'),
		title: 'ประกาศรายชื่อ'
	},
	{
		date: new Date('2024-03-08'),
		title: 'เปิดค่าย'
	},
	{
		date: new Date('2024-03-10'),
		title: 'ปิดค่าย'
	}
];

const stats = [
	{
		title: 'คอมแคมป์รุ่น',
		value: 22,
		increase: 1,
		initValue: '12',
		symbol: 'nd',
		imgBg: new URL('$lib/assets/red-flag.png', import.meta.url).href,
		subtitle: 'คอมแคมป์ของเราถูกตั้งขึ้นครั้งแรกเมื่อปี พ.ศ 2543'
	},
	{
		title: 'จำนวนผู้สมัครทั้งหมด',
		value: 2000,
		increase: 10,
		initValue: '1900',
		symbol: '+',
		imgBg: new URL('$lib/assets/student.png', import.meta.url).href,
		subtitle: 'จำนวนน้อง ๆ ที่เคยสมัครทั้งหมดตั้งแต่รุ่นแรก'
	},
	{
		title: 'จำนวนการตอบรับ',
		value: 95,
		increase: 5,
		initValue: '50',
		symbol: '%',
		imgBg: new URL('$lib/assets/cheer-up.png', import.meta.url).href,
		subtitle: 'จำนวนน้อง ๆ ที่ให้ฟีดแบคแก่ค่ายของเรา'
	}
];

const review = [
	{
		comment:
			'ค่ายนี้ดีสุด ๆ จากคนที่ไม่มีพื้นฐาน แต่ก็สามารถเข้าใจได้โดยง่าย และสนุกสนาน เป็นกันเอง แนะนำเลยไม่ผิดหวังครับ',
		name: 'นาย สมชาย ใจดี',
		role: 'นักเรียนชั้นมัธยมศึกษาปีที่ 3',
		gen: 'เด็กคอมแคมป์รุ่นที่ 21',
		image: new URL('$lib/assets/boy_2.png', import.meta.url).href
	},
	{
		comment:
			'ค่ายนี้ไม่ได้มีแค่การสอน แต่ยังมีกิจกรรมที่ให้ร่วมสนุกกับพี่ ๆ และเพื่อน ๆ ต่างสถาบัน คุ้มค่ามากแก่การมาเลยค่ะ',
		name: 'นาย สมชาย ใจดี',
		role: 'นักเรียนชั้นมัธยมศึกษาปีที่ 5',
		gen: 'เด็กคอมแคมป์รุ่นที่ 20',
		image: new URL('$lib/assets/girl_2.png', import.meta.url).href
	},
	{
		comment:
			'ค่ายนี้ได้ความรู้ ประสบการณ์ที่นำไปปรับใช้ได้จริง อาจารย์และรุ่นพี่ใจดี พี่แนะนำว่าน้อง ๆ ที่กำลังเรียนหรือสนใจสายนี้ ค่ายนี้ตอบโจทย์ค่ะ',
		name: 'นางสาว สุดใจ รักสัตว์',
		role: 'นักเรียนชั้นมัธยมศึกษาปีที่ 6',
		gen: 'เด็กคอมแคมป์รุ่นที่ 19',
		image: new URL('$lib/assets/girl.png', import.meta.url).href
	}
];

const sponsor = [
	{
		src: new URL('$lib/assets/MJU_LOGO.svg', import.meta.url).href,
		bgClass: 'bg-green-700',
		visible: true
	},
	{
		src: '',
		bgClass: '',
		visible: false
	},
	{
		src: '',
		bgClass: '',
		visible: false
	},
	{
		src: 'https://secretary-science.mju.ac.th/goverment/25570522101243_science_secretary/Logo_25630318164611_166727.png',
		bgClass: 'bg-emerald-400',
		visible: true
	}
];

const contract = {
	socials: [
		{
			name: 'Compcamp',
			link: 'https://www.facebook.com/comcamp',
			icon: 'https://store-images.s-microsoft.com/image/apps.37935.9007199266245907.b029bd80-381a-4869-854f-bac6f359c5c9.91f8693c-c75b-4050-a796-63e1314d18c9?h=464'
		},
		{
			name: '@cs_mju',
			link: 'https://www.tiktok.com/@cs_mju',
			icon: 'https://play-lh.googleusercontent.com/Ui_-OW6UJI147ySDX9guWWDiCPSq1vtxoC-xG17BU2FpU0Fi6qkWwuLdpddmT9fqrA'
		},
		{
			name: '@comscimaejo',
			link: 'https://www.youtube.com/@comscimaejo/featured',
			icon: 'https://media.licdn.com/dms/image/C4D0BAQEfoRsyU4yUzg/company-logo_200_200/0/1631053379295?e=2147483647&v=beta&t=sC4ly-3J62akob3aXApCoHAYNzU8oHGJBLX3omD0ZNU'
		}
	],
	telContractor: [
		{
			name: 'พี่โอม',
			tel: '095-658-5160'
		}
	],
	location: {
		longitude: 99.01289125288045,
		latitude: 18.89582011340911,
		address:
			'สาขาวิชาวิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์ มหาวิทยาลัยแม่โจ้ 63 หมู่ 4 ตำบลหนองหาร อำเภอสันทราย จังหวัดเชียงใหม่ 50200 ประเทศไทย (Science Learning Center)',
		place: 'มหาวิทยาลัยแม่โจ้'
	}
};

const faq = [
	{
		question: 'ค่ายนี้เหมาะกับใครบ้างคะ',
		answer: 'น้องๆ ที่สนใจในคอมพิวเตอร์ หรือสนใจเรียนต่อด้านสายนี้ และอยากเรียนรู้เพิ่มเติมครับ'
	},
	// {
	// 	question: 'ค่ายนี้มีค่าใช้จ่ายไหม?',
	// 	answer: 'ค่ายนี้ไม่มีค่าใช้จ่ายใดๆ ทั้งสิ้น'
	// },
	{
		question: 'ค่ายนี้จัดที่ไหนครับ',
		answer:
			'ค่ายนี้จัดที่ ตึก 60 ปี คณะวิทยาศาสตร์ มหาวิทยาลัยแม่โจ้ 63 หมู่ 4 ตำบลหนองหาร อำเภอสันทราย จังหวัดเชียงใหม่ 50200 ประเทศไทย (Science Learning Center) ค่ะ'
	},
	{
		question: 'ค่ายนี้มีกิจกรรมอะไรบ้างกันบ้างคะ',
		answer:
			'ค่ายนี้มีกิจกรรมหลัก ๆ อยู่ 2 สวน ส่วนแรกเป็นการเรียนการสอน ได้แก่ การเรียนรู้ทางทฤษฎี การฝึกฝนทักษะและการสร้างชิ้นงานนำเสนอค่ะ ส่วนอันที่สองเป็นกิจกรรมร่วมสนุกที่ทางพวกพี่ ๆ ได้จัดเตรียมให้ค่ะ ส่วนจะเป็นอะไรนั้นต้องรอลุ้นกันในค่ายนะคะ :)'
	},
	{
		question: 'ไม่มีพื้นฐานทางด้านคอมพิวเตอร์เลย สามารถมาสมัครได้มั้ยครับ?',
		answer:
			'ไม่จำเป็นต้องมีความรู้พื้นฐานอะไรมาก่อน น้อง ๆ ก็สามารถมาได้ แต่ถ้ามีความรู้พื้นฐานอยู่แล้วก็จะเป็นประโยชน์ต่อการเรียนรู้ในค่ายค่ะ'
	},
	{
		question: 'ต้องเตรียมอุปกรณ์อะไรมาบ้างคะ?',
		answer:
			'ต้องเตรียมคอมพิวเตอร์แบบพกพา (Laptop) ส่วนตัวมาเองเพื่อใช้ในการเรียนการสอน รวมทั้งเสื้อผ้าชุดนอนสำหรับการอยู่ใน 2 คืน 3 วันค่ะ'
	},
	{
		question: 'ค่ายนี้จัดการเรียนการสอนอะไรบ้างหรือคะ',
		answer:
			'ค่ายนี้จัดการเรียนการสอนในสาขาวิทยาการคอมพิวเตอร์ และไอที โดยทางค่ายเคยมีการสอนในหลายๆ ด้าน ได้แก่ การพัฒนาเว็บไซต์ การพัฒนาโปรแกรม การพัฒนาแอปพลิเคชัน การพัฒนาโปรแกรมด้วยภาษา Python และอื่น ๆ โดยแต่ละครั้งการสอนจะแตกต่างกันไปตามทางค่ายที่เลือกจัดครับ'
	},
	{
		question: 'ค่ายนี้จัดแบบค้างคืนหรือปล่าวครับ แล้วพักที่ไหนครับ',
		answer:
			'ค่ายนี้จัดแบบค้างคืน 2 คืน 3 วันค่ะ โดยจัดพักที่หอพักพิเศษสำหรับบุคคลภายนอก ภายในมหาวิทยาลัยแม่โจ้ จังหวัดเชียงใหม่ค่ะ'
	},
	{
		question: 'การเข้าค่ายในครั้งนี้ จะได้รับเกียรติบัตรหรือประกาศนียบัตรอะไรมั้ยครับ',
		answer: 'ใด้ค่ะ น้อง ๆ ที่เข้าร่วมค่ายจะได้รับเกียรติบัตร หรือ ประกาศนียบัตรค่ายกันทุกคนค่ะ'
	},
	{
		question: 'ค่ายนี้มีเกณฑ์การรับคน หรือการสมัครอย่างไรบ้างคะ',
		answer:
			'เกณฑ์การคัดเลือกจะพิจารณาจากความถูกค้องที่ระบุในการสมัครค่ะ ถ้าน้องกรอกข้อมูลที่ระบุในการสมัครครบถ้วนก็เข้าร่วมกับทางค่ายได้เลยค่ะ จนกว่าจะเต็มจำนวนที่รับสมัครไว้'
	}
];

const imgGallery = {
	galleryOne: [
		new URL('$lib/assets/activity/img_1.jpeg', import.meta.url).href,
		new URL('$lib/assets/activity/img_2.jpeg', import.meta.url).href,
		new URL('$lib/assets/activity/img_3.jpeg', import.meta.url).href,
		new URL('$lib/assets/activity/img_4.jpeg', import.meta.url).href
	],
	galleryTwo: [
		new URL('$lib/assets/activity/img_5.jpeg', import.meta.url).href,
		new URL('$lib/assets/activity/img_6.jpeg', import.meta.url).href,
		new URL('$lib/assets/activity/img_7.jpeg', import.meta.url).href,
		new URL('$lib/assets/activity/img_8.jpeg', import.meta.url).href
	]
};

export {
	aboutComcamp,
	learningObjectives,
	benefits,
	timeline,
	faq,
	stats,
	review,
	sponsor,
	contract,
	actionMenu,
	navbarMenu,
	imgGallery
};
