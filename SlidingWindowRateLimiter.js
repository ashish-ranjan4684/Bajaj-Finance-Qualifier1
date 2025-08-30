class SWRateLimiter{
    constructor(windowSize,maxRequests){
        this.windowSize = windowSize;
        this.maxRequests = maxRequests;
        this.bucket = {};
        this.limit = this.limit.bind(this);
        setInterval(()=>{
            for(let ip in this.bucket){
                if(this.bucket[ip].length===0){
                    delete this.bucket[ip];
                }
            }
        })
    }
    limit(req,res,next){
        let ip = req.ip;

        if(!this.bucket[ip]){
            this.bucket[ip]=[Date.now()];
            console.log(`${ip} encountered first time`);
            return next();
        }
        else{
            let curr_ts = Date.now()
            for(let i= 0;i<this.bucket[ip].length;i++){
                if(this.bucket[ip][i]>curr_ts-this.windowSize)break;
                this.bucket[ip].splice(0,1);
            }
            if(this.bucket[ip].length < this.maxRequests){
                this.bucket[ip].push(curr_ts);
                console.log(`allowed ${ip}`);
                return next();
            }else{
                console.log(`request blocked as user ${ip} requested ${this.bucket[ip].length} requests within ${this.windowSize}`);
                res.sendStatus(429);
            }
        }

    }
}

module.exports = {SWRateLimiter};
