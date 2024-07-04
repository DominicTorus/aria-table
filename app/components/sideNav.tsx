'use client'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarContent,
  NavbarItem
} from '@nextui-org/react'
import React from 'react'
import {
  ChevronDown,
  Lock,
  Activity,
  Flash,
  Server,
  TagUser,
  Scale
} from './IconsHead'
import { FaChevronRight } from 'react-icons/fa'

const SideNav = () => {
  const icons = {
    chevron: (
      <ChevronDown
        fill='currentColor'
        size={16}
        height={undefined}
        width={undefined}
      />
    ),
    scale: (
      <Scale
        className='text-warning'
        fill='currentColor'
        size={30}
        height={undefined}
        width={undefined}
      />
    ),
    lock: (
      <Lock
        className='text-success'
        fill='currentColor'
        size={30}
        height={undefined}
        width={undefined}
      />
    ),
    activity: (
      <Activity
        className='text-secondary'
        fill='currentColor'
        size={30}
        height={undefined}
        width={undefined}
      />
    ),
    flash: (
      <Flash
        className='text-primary'
        fill='currentColor'
        size={30}
        height={undefined}
        width={undefined}
      />
    ),
    server: (
      <Server
        className='text-success'
        fill='currentColor'
        size={30}
        height={undefined}
        width={undefined}
      />
    ),
    user: (
      <TagUser
        className='text-danger'
        fill='currentColor'
        size={30}
        height={undefined}
        width={undefined}
      />
    )
  }
  return (
    <div className=' flex h-[600px] w-[10%] flex-col  bg-red-200 '>
      <Navbar className='h-full  '>
        <NavbarContent className='flex flex-col   '>
          <Dropdown placement='right'>
            <NavbarItem isActive>
                <DropdownTrigger>
                    <Button
                    disableRipple
                    className='mr-8 bg-transparent p-0 data-[hover=true]:bg-transparent'
                    endContent={<FaChevronRight />}
                    radius='sm'
                    variant='light'
                    >
                    Tables
                    </Button>
                </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label='Table Details'
              className='w-[200px] '
              itemClasses={{
                base: 'gap-4'
              }}
            >
                <DropdownItem key='Users'  href='Users'>
                    Users
                </DropdownItem>
                <DropdownItem key='Posts'  href='Posts'>
                    Posts
                </DropdownItem>
                <DropdownItem key='Profiles'  href='Profiles'>
                    Profiles
                </DropdownItem>
                <DropdownItem key='bankMaster'  href='bankMaster'>
                    bankMaster
                </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
    </div>
  )
}

export default SideNav
