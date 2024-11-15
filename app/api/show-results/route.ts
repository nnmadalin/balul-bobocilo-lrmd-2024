import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient} from "@prisma/client"


const prisma = new PrismaClient();

export async function GET(request: Request) {
    try{
        const passwordENV = process.env.PASSWORD_ADMIN;

        if( new URL(request.url).searchParams.get('pass') == passwordENV){
            const fetchData = await prisma.teams.findMany();
            return NextResponse.json({ status:"ok", message:"Authorized", data:fetchData}, { status: 200 });

        }else
            return NextResponse.json({ status:"failed", message: "Nu esti autorizat sa vezi aceasta pagina :( !" }, { status: 401 });
    }catch(error : any){
        return NextResponse.json({ status:"failed", message: error.message }, { status: 400 });
    }finally{
        prisma.$disconnect();
    }
}
