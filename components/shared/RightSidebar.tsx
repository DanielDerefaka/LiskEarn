import React from "react";

;

const RightSidebar = ({ user }: any) => {
  return (
    <aside className="right-sidebar">
           <section className="flex flex-col pb-8">
        <div className="profile-banner" />
        <div className="profile">
          
 
         
       
          {/* <ModeToggle/> */}
        </div>

       
      </section>

      {/* <section className="banks">
        <div className="flex w-full justify-between">
        <h2 className="header-2">
            My Account
        </h2>
        </div>

      </section> */}
    </aside>
  );
};

export default RightSidebar;
