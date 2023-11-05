import Link from 'next/link';
import React from 'react';

const Nav = () => {
    return (
        <div>
            <li><Link href="/">Home</Link></li>
            <li><Link href={'/hajira-hisab'}>Hisab Nikash</Link></li>
            <li><Link href={'/cricket/series'}>Series</Link></li>
            <li><Link href={'/livestreaming'}>Live Stream</Link></li>
            <li><Link href={'/videoconvert'}> VideoC</Link></li>
           
        </div>
    );
};

export default Nav;