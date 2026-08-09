"use client"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenuItem, SidebarMenuButton, SidebarMenu, useSidebar } from "@/components/ui/sidebar"
import { LayoutDashboard, Bot, Presentation, CreditCard, Plus } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import useProject from "../hooks/use-project"

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Q&A",
        url: "/qa",
        icon: Bot
    },
    {
        title: "Meetings",
        url: "/meeting",
        icon: Presentation
    },
    {
        title: "Billing",
        url: "/billing",
        icon: CreditCard
    },
]

export function AppSidebar() {
    const pathname = usePathname()
    const { open } = useSidebar()
    const {projects, projectId, setProjectId} = useProject()
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    {/* <Image
                        src="/logo3.png"
                        alt="Synapta-logo"
                        width={50}
                        height={55}
                        className="shrink-0 object-contain"
                        priority
                    /> */}


                    {open && (
                        <div className="flex flex-col leading-tight">
                            <h1 className="text-lg font-semibold text-primary">
                                GitIntellect
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Ask GitIntellect, AI that Knows Your Codebase.
                            </p>
                        </div>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-primary/70">
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>

                        {items.map(item => {
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url} className={cn({
                                            'bg-primary text-white': pathname === item.url,
                                        })}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>

                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-primary/70">
                        Your Projects
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projects?.map(project => {
                                return (
                                    <SidebarMenuItem key={project.id}>
                                        <SidebarMenuButton asChild>
                                            <div onClick={()=>{
                                                setProjectId(project.id)
                                            }}>
                                                <div className={cn(
                                                    'rounded-sm border size-6 flex items-center cursor-pointer justify-center text-sm bg-white text-primary',
                                                    {
                                                        "bg-primary cursor-pointer text-white":project.id===projectId
                                                    }
                                                )}>

                                                    {project.name[0]}
                                                </div>
                                                <span>{project.name}</span>
                                            </div>


                                        </SidebarMenuButton>

                                    </SidebarMenuItem>
                                )
                            })}
                            <div className="h-2"></div>
                            {open && (
                                <SidebarMenuItem>
                                    <Link href="/create" >

                                        <Button variant={"outline"} className="cursor-pointer" >
                                            <Plus />
                                            Create Project</Button>
                                    </Link>

                                </SidebarMenuItem>
                            )}

                        </SidebarMenu>
                    </SidebarGroupContent>

                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}