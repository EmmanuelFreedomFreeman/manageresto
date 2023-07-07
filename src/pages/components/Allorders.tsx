import React, { useEffect, useRef, useState } from 'react'
import { useSession} from "next-auth/react"
import { doc, onSnapshot,setDoc } from "firebase/firestore";
import { db } from '../../../firebase';

function Allorders() {
  let orderss:any = []
    const { data: session } = useSession()
    const [order, setOrder] = useState<any[]>([])
    const [listorder, setListOrder] = useState<any[]>([])
    const [companydetails, setCompanydetails] = useState<any>({})
    const [note, setNote] = useState(0)
    const [total, settotal] = useState(0)
    const [display, setDisplay] = useState<any>()
    const company = String(session?.user?.email)
    const [conf, setconf] = useState('')
    const [dat, setdat] = useState('')
    const [state, setstate] = useState('')
    const [name, setname] = useState('')
    const [cance, setcance] = useState('')
    let compref = useRef(null)
    
    const toprint = () => {
        var mywindow = window.open('', 'PRINT', 'height=600,width=800');

        const content = `
        
        <div>
        <p style='text-align: center;text-decoration: underline;'>${companydetails?.name?.toUpperCase()}</p>
        <div>
            <div style='text-align:center'>
                <p>NAME : ${display?.data?.name.toUpperCase()}</p>
                <p>TABLE : ${display?.data?.url?.table}</p>
                <p>N* ORD : ${display?.data?.ordernumber} </p>
                <p>TEL : ${companydetails?.contact?.toUpperCase()}</p>
                ${display?.data?.date ? (
                    `<p>DATE : ${new Date(display?.data?.date).getDate()} / ${new Date(display?.data?.date).getMonth()+1}  / ${new Date(display?.data?.date).getFullYear()}  : ${new Date(display?.data?.date).getHours()}H - ${new Date(display?.data?.date).getMinutes()}Min - ${new Date(display?.data?.date).getSeconds()}Sec - ${new Date(display?.data?.date).getMilliseconds()}Milli </p>`
            
                ):(`<p>DATE : ${Date.now()}</p>`)}
                
            </div>
            
            <div style='border: thick double #32a1ce; padding-left: 50px;'>
                ${display?.data?.data?.map((value: any,index: any) => (
                    `<div key=${index} >
                        <p>${index+1}) ${value?.name?.toUpperCase()} : FC ${new Intl.NumberFormat('en-US').format(value?.amount)} * ${value?.qte} = FC ${new Intl.NumberFormat('en-US').format(value?.amount * value?.qte)} </p>
                    </div>`
                ))}
                
            </div>
            <p style='text-align:right;font-weight: bold;font-size: 20px;;text-decoration: underline;'>TOTAL AMOUNT : FC ${new Intl.NumberFormat('en-US').format(display?.data?.total? display?.data?.total : 0)} </p>
            
        </div>
    </div>
        
        `
        mywindow?.document.write('<html><head><title>' + document.title  + '</title>');
        mywindow?.document.write('</head><body >');
        mywindow?.document.write('<h1>' + document.title  + '</h1>');
        
        mywindow?.document.write(content);
        mywindow?.document.write('</body></html>');

        mywindow?.document.close(); // necessary for IE >= 10
        mywindow?.focus(); // necessary for IE >= 10*/

        mywindow?.print();
        mywindow?.close();
    }

    
    
    
    
    const displayorders = (index: number) => {
        const temp = {data : listorder[index],ind : index}
        setDisplay(temp) 
        
    }

    const confirmation = async() => {
        setconf('0')
       let data = display?.data 
       let temp = {
            data : data.data,
            date:data.date,
            etat:'confirm',
            name:data.name,
            ordernumber: data.ordernumber,
            total:data.total,
            url:data.url
       }
       const t = order
       t[display?.ind] = temp
        try {
            await setDoc(doc(db,company, "ORDER"), {order:t});
            setconf('1')
            toprint()
        } catch (error) {
            
        }
    }

    const cancel = async() => {
        setcance('0')
        let data = display?.data 
        let temp = {
             data : data.data,
             date:data.date,
             etat:'cancel',
             name:data.name,
             ordernumber: data.ordernumber,
             total:data.total,
             url:data.url
        }
        const t = order
        t[display?.ind] = temp
         try {
             await setDoc(doc(db,company, "ORDER"), {order:t});
             setcance('1')
             alert('the order has been canceled')
         } catch (error) {
             
         }
     }

     const listebyname = () => {
        settotal(0)
        let ord = [...order]
        let temp:any = []
        setListOrder([...order])
        order.map((value,ind)=>{
          //value?.name?.toUpperCase()?.trim() == name.toUpperCase().trim() ? temp.push(value):null;
          let ar = value?.name?.toUpperCase()?.trim().split(name.toUpperCase().trim())
          ar.length > 1 ? temp.push(value):null;
        })
        name != '' && temp.length !==0 ? setListOrder([...temp]):null
        name != '' && temp.length == 0 ? setListOrder([]):null
        
     }

     const day = () => {
        settotal(0)
        let ord = [...order]
        let temp:any = []
        setListOrder([...order])
        let t = 0
        order.map((value,ind)=>{
          var dt = new Date(value?.date);
          var day = new Date(dat);
          if (dt.getDate() == day.getDate() && dt.getMonth() == (day.getMonth()) && dt.getFullYear() == day.getFullYear() && value?.etat == state  ) {
            temp.push(value)
            t = t + value?.total
          }
          console.log(day.getMonth())
        })
        settotal(t)
        temp.length !==0 ? setListOrder([...temp]):null
        temp.length == 0 ? setListOrder([]):null
        
     }
     const month = () => {
      settotal(0)
      let ord = [...order]
      let temp:any = []
      setListOrder([...order])
      let t = 0
      order.map((value,ind)=>{
        var dt = new Date(value?.date);
        var day = new Date(dat);
        if (dt.getMonth() == (day.getMonth()) && dt.getFullYear() == day.getFullYear() && value?.etat == state  ) {
          temp.push(value)
          t = t + value?.total
        }

        
        
      })
      settotal(t)
      temp.length !==0 ? setListOrder([...temp]):null
      temp.length == 0 ? setListOrder([]):null
      
   }
   const year = () => {
    settotal(0)
    let ord = [...order]
    let temp:any = []
    setListOrder([...order])
    let t = 0
    order.map((value,ind)=>{
      var dt = new Date(value?.date);
      var day = new Date(dat);
      if (dt.getFullYear() == day.getFullYear() && value?.etat == state  ) {
        temp.push(value)
        t = t + value?.total
      }
      
    })
    settotal(t)
    temp.length !==0 ? setListOrder([...temp]):null
    temp.length == 0 ? setListOrder([]):null
    
 }

    useEffect(() => {
        const unsuborders = onSnapshot(doc(db,company, "ORDER"), (doc) => {
            doc.data()?.order? setOrder([...doc.data()?.order]):'';
            doc.data()?.order? setListOrder([...doc.data()?.order]):'';
            
          });
          const unsubcompany = onSnapshot(doc(db,company, "SHOP"), (doc) => {
            doc.data()? setCompanydetails(doc.data()):'';
          });
          
    }, [])
    useEffect(() => {
      
    }, [name])
    
   


  return (
    <div className='flex justify-between p-3'>

        
        <div className=''>
          <div className='flex justify-between mb-3'>
            <input type='text' value={name} onChange={(e)=>setname(e.target.value)} placeholder='name : ' className='w-[8rem]' />
            <input type='date' value={dat} onChange={(e)=>setdat(e.target.value)}/>
            <select onChange={(e)=>setstate(e.target.value)}>
              <option value='choose state'>choose state</option>
              <option value='new order'>new order</option>
              <option value='cancel'>cancel</option>
              <option value='confirm'>confirm</option>
            </select>
          </div>
          <div className='flex justify-between mb-3'>
            <p onClick={()=>listebyname()} className='p-1 bg-blue-400 rounded-md cursor-pointer w-16 text-center hover:bg-blue-600'>NAME</p>
            <p onClick={()=>day()} className='p-1 bg-blue-400 rounded-md cursor-pointer w-16 text-center hover:bg-blue-600'>DAY</p>
            <p onClick={()=>month()}className='p-1 bg-blue-400 rounded-md cursor-pointer w-16 text-center hover:bg-blue-600'>MONTH</p>
            <p onClick={()=>year()}className='p-1 bg-blue-400 rounded-md cursor-pointer w-16 text-center hover:bg-blue-600'>YEAR</p>
            <p className='p-1 bg-blue-400 rounded-md cursor-pointer w-16 text-center hover:bg-blue-600'>STATE</p>
          </div>

            <h1 className='text-center text-2xl font-bold underline'>ALL ORDERS</h1>
            <p>TOTALE : FC {new Intl.NumberFormat('en-US').format(total)}</p>
            <div className='overflow-y-scroll max-h-96 p-4'>
            {listorder.map((value:any,index:number) => (
                <div className={'border-2 mt-5 border-gray-500 p-4 '} key={index}>
                    
                    <div className=''>
                        <div className='flex justify-end'>
                            <p className={'rounded-md text-center hover:bg-slate-500 font-bold cursor-pointer p-3 bg-slate-300 w-16'}>OK</p>
                        </div>
                        <p className='text-center underline font-bold'>{companydetails?.name?.toUpperCase()}</p>
                        <p>TABLE : {value?.url?.table}</p>
                        <p>NUMBER OF ORDER : {value?.ordernumber} </p>
                        {value?.date !=null ? (
                            <p>DATE : {new Date(value?.date).getDate()} / {new Date(value?.date).getMonth()+1}  / {new Date(value?.date).getFullYear()}  : {new Date(value?.date).getHours()}H - {new Date(value?.date).getMinutes()}Min - {new Date(value?.date).getSeconds()}Sec - {new Date(value?.date).getMilliseconds()}Milli </p>
                        ):(<p></p>)}
                        
                        <p className='text-center underline font-bold'>CLIENT'S NAME : {value?.name.toUpperCase()}</p>
                        <div className='border-2 border-gray-300 p-3 m-3'>
                            {value?.data?.map((val:any,ind:any) =>(
                                <div key={ind}>
                                    <p>{ind+1}. {val?.name.toUpperCase()} : FC {new Intl.NumberFormat('en-US').format(val?.amount)} * {new Intl.NumberFormat('en-US').format(val?.qte)} = FC {new Intl.NumberFormat('en-US').format(val?.amount * val?.qte)}</p>
                                </div>
                            ))}
                            
                        </div>
                        <div>
                            <p>TOTAL AMOUNT : FC {new Intl.NumberFormat('en-US').format(value?.total)} </p>
                        </div>
                    </div>
                    <p onClick={() => displayorders(index)} className='cursor-pointer p-4 text-center font-bold text-xl hover:bg-slate-300 bg-slate-100 mt-4 rounded-md'>CHECKING UP THE  DETAILS</p>
                </div>
            )).reverse()}
            </div>
        </div>
        <div>
            

            <div className='border-2 border-gray-500 p-5' id='emma' ref={compref}>
                <p className='text-center underline font-bold'>{companydetails?.name?.toUpperCase()}</p>
                
                <div>
                    <div>
                        <p>NAME : {display?.data?.name.toUpperCase()}</p>
                        <p>TABLE : {display?.data?.url?.table}</p>
                        <p>N* ORD : {display?.data?.ordernumber} </p>
                        <p>TEL : {companydetails?.contact?.toUpperCase()}</p>
                        {display?.data?.date !=null ? (
                            <p>DATE : {new Date(display?.data?.date).getDate()} / {new Date(display?.data?.date).getMonth()+1}  / {new Date(display?.data?.date).getFullYear()}  : {new Date(display?.data?.date).getHours()}H - {new Date(display?.data?.date).getMinutes()}Min - {new Date(display?.data?.date).getSeconds()}Sec - {new Date(display?.data?.date).getMilliseconds()}Milli </p>
                    
                        ):(<p></p>)}
                        
                    </div>
                    <div className='overflow-y-auto max-h-56'>

                        {display?.data?.data?.map((value: any,index: any) => (
                            <div key={index} className='p-2 m-2 border-2 border-gray-500 rounded-md'>

                                <p className='text-center underline font-bold'>{value?.name?.toUpperCase()}</p>

                                <div className='flex justify-between'>
                                    <div>
                                        <img src={value?.image} className='w-20 h-20 object-cover rounded-md' />
                                        
                                    </div>

                                    <div className='flex flex-1 flex-col text-right'>
                                        <p>UNIT AMOUNT : {new Intl.NumberFormat('en-US').format(value?.amount)}</p>
                                        <p className='underline pb-3'>QUANTITY : * {value?.qte}</p>
                                        <p className='font-bold'>TOTAL : FC {new Intl.NumberFormat('en-US').format(value?.amount * value?.qte)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                    </div>
                    <p className='mt-3 mb-3 font-bold'>TOTAL AMOUNT : FC {new Intl.NumberFormat('en-US').format(display?.data?.total? display?.data?.total : 0)} </p>
                    <div className='flex justify-between'>
                        <img onClick={()=> toprint()} src='https://i.pinimg.com/originals/83/3f/f4/833ff413a2ad4abf49b72d8fae9198d3.jpg' alt='print' className='w-14 h-14 cursor-pointer rounded-md' />
                        <img onClick={()=> confirmation()} src={conf == '' || conf == '1'  ?'data:image/png;base64,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':'https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif'} alt='print' className='w-14 h-14 cursor-pointer rounded-md' />
                        <img onClick={()=> cancel()} src={cance == '' || cance == '1'  ?'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2ZHIDTj48-MPJgzYFgx0w7Bn5VbMSfbz-uA&usqp=CAU':'https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif'} alt='print' className='w-14 h-14 cursor-pointer rounded-md' />
                        
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default Allorders