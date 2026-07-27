const willRecreateBlockedUpdate = (pr) => { 
  let blockedPrNumber = pr.number; 
  if (blockedPrNumber === undefined) { 
    const title = pr.data?.title ?? pr.title; 
    const match = /#(\d+)/.exec(title); 
    blockedPrNumber = match ? match[1] : null; 
  } 
  return blockedPrNumber !== undefined; 
};