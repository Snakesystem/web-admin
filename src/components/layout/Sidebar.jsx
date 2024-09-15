import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingSkeleton } from '../../utils/utility';
import { useMenu } from '../../context/menu';
import { useRebuildTable } from '../../hooks/useRebuildTable';

export default function Sidebar(props) {

    const { show } = props ;
    const { menu, isLoading } = useMenu();

  return (
    <aside className={`sidebar ${show ? 'show-sidebar' : null}`}>
        <nav className='nav'>
            <ul className='metismenu justify-content-center'>
                {  
                    isLoading ? <LoadingSkeleton count={3} heignt={100}/> : 
                    menu?.map((item, index) => (
                        <li key={index} className="item-menu">
                            <MenuAccordion menu={item} showToggle={show} />
                        </li>
                    ))
                }
            </ul>
        </nav>
    </aside>
  )
}

const MenuAccordion = ({ menu, showToggle }) => {
    const [curOpen, setCurOpen] = useState(null)

    return (
        <div className="menu-class">
            <MenuItems curOpen={curOpen} onOpen={setCurOpen} menu={menu} showToggle={showToggle}/>
        </div>
    )
}

const MenuItems = (props) => {
    const { curOpen, onOpen, menu, showToggle } = props
    const openMenu = menu.MenuNID === curOpen;
    const { destroyTable, buildTable } = useRebuildTable();

    function toggleMenu() {
        onOpen(openMenu ? null : menu.MenuNID)
    }

    const rebuildTable = () => {
        destroyTable();
        buildTable();
    }

    return (
        <div className={`container my-2 py-3 menu-item ${openMenu ? 'menu-openve' : ""}`}>
            <div className="d-flex flex-column justify-content-center align-items-center" title={menu.MenuTitle}>
                {
                    menu.MenuID === 'dashboard' ? 
                    <Link to={`/${menu.MenuID}`} className="cursor-pointer d-flex flex-column my-2 justify-content-center align-items-center" onClick={toggleMenu}>
                        <span className={`menu-icon ${menu.MenuIcon}`}></span>
                        { showToggle && <span className="menu-title ms-3">{menu.MenuTitle}</span> }
                    </Link> : <div className="cursor-pointer d-flex flex-column my-2 justify-content-center align-items-center" onClick={toggleMenu}>
                        <span className={`menu-icon ${menu.MenuIcon}`}></span>
                        { showToggle && <span className="menu-title ms-3">{menu.MenuTitle}</span> }
                    </div>
                }
                { menu.BankID?.length > 0 && <div onClick={toggleMenu} className="flex-row"> { showToggle && <i className="menu-icon">{openMenu ? "" : "+"}</i>}</div> }
                { openMenu && menu.BankID?.map((bank, index) => (
                    <Link key={index} to={`/${menu.MenuID}/${bank}`} onClick={rebuildTable} className="d-flex flex-row justify-content-center py-2 sub-menu-item">
                        <div className="content-box">
                            {showToggle && <span className="menu-number">{index < 10 ? `0${index + 1}` : index + 1} </span>}
                            {showToggle ? <span>{bank}</span> : <span title={bank} style={{fontSize: '10px', fontWeight: 'bold'}}>{bank}</span>}
                        </div>
                    </Link>
                ) ) }
            </div>
        </div>
    )
}